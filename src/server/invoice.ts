import * as fluentreports from 'fluentreports';
import { PDFString } from 'pdf-lib';

var Report = fluentreports.Report;

import * as fontkit from '@pdf-lib/fontkit';
import express, { Router } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import {
  PDFDict,
  PDFHexString,
  PDFDocument as PDFLibDocument,
  PDFName,
} from 'pdf-lib';
import { repo } from 'remult';
import ZUGFeRDGenerator from 'zugferd-generator';
import { CompanySettings } from '../shared/entities/company-settings';
import { Invoice } from '../shared/entities/invoice';
import { InvoiceItem } from '../shared/entities/invoice-item';
import { api } from './api';
import { randomBytes } from 'crypto';

export const invoice = Router();
invoice.use(express.json());
invoice.use(api.withRemult);

invoice.get('/api/invoice/pdf', async (req, res) => {
  if (!req.session) {
    res.status(401).send('Unauthorized');
    return;
  }

  const invoice = await repo(Invoice).findFirst({ id: req.query.id });
  if (!invoice) {
    res.status(404).send('Invoice not found');
    return;
  }

  const companySettings = await repo(CompanySettings).findFirst();
  if (!companySettings) {
    res.status(404).send('Company settings not found');
    return;
  }
  const buffer = await renderInvoice(invoice, companySettings);

  const bufferA3 = await convertToPDFA3(buffer);

 // const bufferZugFERD = await attachZugferd(invoice, companySettings, bufferA3);

  res.setHeader('Content-Type', 'application/pdf');
  res.send(bufferA3);
});

function formatCurrency(value: number) {
  return value.toFixed(2) + ' EUR';
}

function formatDate(date: Date) {
  return date.toLocaleDateString();
}

export async function renderInvoice(
  invoice: Invoice,
  companySettings: CompanySettings
): Promise<Buffer> {
  if (!invoice?.items) {
    throw new Error('Invoice items not found');
  }
  const primary_data = invoice.items.map((item, index) => ({
    posNr: index + 1,
    item,
  }));

  var detail = function (x, r: { posNr: number; item: InvoiceItem }, s) {
    x.band(
      [
        { data: ' ' + r.posNr + '.', width: 40, align: 1 },
        { data: r.item.name, width: 240, align: 1 },
        {
          data: r.item.quantity + ' ' + r.item.amountType,
          width: 60,
          align: 3,
        },
        { data: formatCurrency(r.item.price), width: 90, align: 3 },
        { data: formatCurrency(r.item.total), width: 90, align: 3 },
      ],
      { x: 20, addY: 10 }
    );
  };

  var tableFooter = function (x, r) {
    x.fontNormal();
    x.bandLine(1, 10);
    x.band(
      [
        { data: 'Gesamtbetrag netto', width: 280, align: 1 },
        {
          data: formatCurrency(invoice.netTotal),
          width: 60 + 90 + 90,
          align: 3,
        },
      ],
      { x: 20, addY: 10 }
    );
    for (const item of invoice.vatTotals) {
      x.band(
        [
          {
            data: 'zzgl. Umsatzsteuer ' + item.vat + '%',
            width: 280,
            align: 1,
          },
          {
            data: formatCurrency(item.total),
            width: 60 + 90 + 90,
            align: 3,
          },
        ],
        { x: 20, addY: 10 }
      );
    }
    x.fontBold();
    x.fontSize(14);
    x.band(
      [
        { data: 'Gesamtbetrag brutto', width: 280, align: 1 },
        {
          data: formatCurrency(invoice.grossTotal),
          width: 60 + 90 + 90,
          align: 3,
        },
      ],
      { x: 20, addY: 10 }
    );
    x.fontNormal();
  };

  var proposalHeader = function (x, r) {
    // Neues Logo im oberen rechten Bereich hinzufügen
    if (companySettings.companyLogo) {
      x.image(companySettings.companyLogo, { x: 460, y: 30, width: 100 });
    }

    x.band([], { y: 120 });

    x.band([{ data: companySettings.addressLineFormat, width: 300 }], {
      x: 20,
      fontSize: 9,
    });

    x.band([], { y: 150 });
    for (const line of invoice.address.split('\n')) {
      x.band([{ data: line, width: 150 }], { x: 20 });
    }

    x.band(
      [
        { data: 'Rechnungsnr.:', width: 160 },
        { data: invoice.invoiceNumber, width: 80, align: 'right' },
      ],
      { x: 300, y: 150 }
    );
    x.band(
      [
        { data: 'Rechnungsdatum:', width: 160 },
        {
          data: invoice.createdAt ? formatDate(invoice.createdAt) : '',
          width: 80,
          align: 'right',
        },
      ],
      { x: 300 }
    );

    x.fontSize(14);
    x.fontBold();
    x.print(invoice.subject, { x: 40, y: 250, width: 540 });
    x.fontNormal();
    x.newline();

    x.fontSize(11);

    x.print(invoice.headerText, { x: 40 });
    x.newline();

    x.band(
      [
        { data: 'Pos.', width: 40 },
        { data: 'Bezeichnung', width: 240 },
        { data: 'Menge', width: 60, align: 3 },
        { data: 'Einzelpreis', width: 90, align: 3 },
        { data: 'Gesamtpreis', width: 90, align: 3 },
      ],
      { x: 20 }
    ); // , font: "AldotheApache"});
    x.bandLine(1);
  };

  var proposalFooter = function (x, r) {
    x.fontSize(11);

    x.print(invoice.footerText, { x: 40, addY: 20, width: 570 });
  };

  // Neue Funktion zur Darstellung des Seitenfußes mit Bankdaten
  var pageFooter = function (x) {
    x.fontSize(8);
    // Entferne y: 780, damit die Standard-Position genutzt wird

    const bandColWidth = 135;
    x.band(
      [
        {
          data:
            companySettings.companyName || companySettings.companySuffix
              ? companySettings.companyName +
                ' ' +
                companySettings.companySuffix
              : '',
          width: bandColWidth,
          align: 1,
        },
        {
          data: companySettings.phone ? 'Tel.: ' + companySettings.phone : '',
          width: bandColWidth,
          align: 1,
        },
        {
          data: companySettings.court ? companySettings.court : '',
          width: bandColWidth,
          align: 1,
        },
        {
          data: companySettings.bankName ? companySettings.bankName : '',
          width: bandColWidth,
          align: 1,
        },
      ],
      { x: 10, y: 760, align: 'center' }
    );
    x.band(
      [
        {
          data: companySettings.street ? companySettings.street : '',
          width: bandColWidth,
          align: 1,
        },
        {
          data: companySettings.fax ? 'Fax: ' + companySettings.fax : '',
          width: bandColWidth,
          align: 1,
        },
        {
          data: companySettings.commercialRegisterNumber
            ? 'HR-Nr.: ' + companySettings.commercialRegisterNumber
            : '',
          width: bandColWidth,
          align: 1,
        },
        {
          data: companySettings.iban ? 'IBAN: ' + companySettings.iban : '',
          width: bandColWidth,
          align: 1,
        },
      ],
      { x: 10, addY: 2, align: 'center' }
    );
    x.band(
      [
        {
          data:
            companySettings.postalCode || companySettings.city
              ? companySettings.postalCode + ' ' + companySettings.city
              : '',
          width: bandColWidth,
          align: 1,
        },
        {
          data: companySettings.email ? companySettings.email : '',
          width: bandColWidth,
          align: 1,
        },
        {
          data: companySettings.ustId
            ? 'USt.-ID: ' + companySettings.ustId
            : '',
          width: bandColWidth,
          align: 1,
        },
        {
          data: companySettings.bic ? 'BIC: ' + companySettings.bic : '',
          width: bandColWidth,
          align: 1,
        },
      ],
      { x: 10, addY: 2, align: 'center' }
    );
    x.band(
      [
        {
          data: companySettings.country ? companySettings.country : '',
          width: bandColWidth,
          align: 1,
        },
        {
          data: companySettings.website ? companySettings.website : '',
          width: bandColWidth,
          align: 1,
        },
        {
          data: companySettings.taxNumber
            ? 'Steuer-Nr.: ' + companySettings.taxNumber
            : '',
          width: bandColWidth,
          align: 1,
        },
        { data: '', width: bandColWidth, align: 1 },
      ],
      { x: 10, addY: 2, align: 'center' }
    );
    x.band(
      [
        { data: '', width: bandColWidth, align: 1 },
        { data: '', width: bandColWidth, align: 1 },
        {
          data: companySettings.ceo
            ? 'Geschäftsführung: ' + companySettings.ceo
            : '',
          width: bandColWidth,
          align: 1,
        },
        { data: '', width: bandColWidth, align: 1 },
      ],
      { x: 10, addY: 2, align: 'center' }
    );
  };

  // To Keep fonts rendered identically on all test machines, we are setting the default
  // Font to be "Arimo" which is close to the normal default "Helvetica" font.
  var report = new Report('buffer', { font: 'Arimo', paper: 'A4' }).data(
    primary_data
  );
  report.registerFont('Arimo', {
    normal: __dirname + '/e-invoice/fonts/Arimo-Regular.ttf',
    bold: __dirname + '/e-invoice/fonts/Arimo-Bold.ttf',
    italic: __dirname + '/e-invoice/fonts/Arimo-Italic.ttf',
  });

  // Normally you would register a different font for each normal, bold, and italic; but for space size we are registering the same font for all three
  report.registerFont('AldotheApache', {
    normal: __dirname + '/e-invoice/fonts/AldotheApache.ttf',
    bold: __dirname + '/e-invoice/fonts/AldotheApache.ttf',
    italic: __dirname + '/e-invoice/fonts/AldotheApache.ttf',
  });

  var r = report.margins(20).detail(detail);

  report
    .groupBy('no')
    .header(proposalHeader)
    .footer(proposalFooter)
    .groupBy('product.product_type')
    .sum('amount')
    .footer(tableFooter);

  // Verschiebe pageFooter hierher, vor dem Render-Aufruf:
  report.pageFooter(pageFooter);

  //r.printStructure();

  return new Promise((resolve, reject) => {
    r.render(function (err, buffer: Buffer) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(buffer);
      }
    });
  });
}
async function attachZugferd(
  invoice: Invoice,
  companySettings: CompanySettings,
  invoicePdf: Buffer<ArrayBufferLike>
) {
  // Prepare invoiceData based on invoice and companySettings
  const invoiceData = {
    id: invoice.id,
    issueDate: invoice.invoiceDate.toISOString(),
    // dueDate optional
    currency: 'EUR', // Annahme: feste Währung
    totalAmount: invoice.grossTotal,
    supplier: {
      name: companySettings.companyName,
      country: companySettings.country,
      street: companySettings.street,
      postalCode: companySettings.postalCode,
      city: companySettings.city,
      taxNumber: companySettings.taxNumber,
      legalEntityID: companySettings.ustId,
    },
    customer: {
      name: invoice.address.split('\n')[0] || '',
      street: invoice.address.split('\n')[1] || '',
      postalCode: invoice.address.split('\n')[2]?.split(' ')[0] || '',
      city: invoice.address.split('\n')[2]?.split(' ').slice(1).join(' ') || '',
      country: 'Deutschland', // ggf. ergänzen
    },
    taxTotal: {
      taxAmount: invoice.vatTotals[0]?.total || 0,
      taxPercentage: invoice.vatTotals[0]?.vat || 0,
    },
    paymentDetails: {
      bankDetails: {
        accountName: companySettings.companyName,
        iban: companySettings.iban,
        bic: companySettings.bic,
        bankName: companySettings.bankName,
      },
    },
    notes: [invoice.reference, invoice.headerText, invoice.footerText].filter(
      (n) => n
    ),
    lineItems: invoice.items!.map((item, index) => ({
      id: item.id || index.toString(),
      description: item.name,
      quantity: item.quantity,
      unitPrice: item.price,
      lineTotal: item.total,
    })),
  };

  const zugferd = new ZUGFeRDGenerator(invoiceData);
  const xmlString = zugferd.toXMLString();
  console.log(xmlString);

  return zugferd.embedInPDF(invoicePdf);
}

async function convertToPDFA3(inputBuffer: Buffer): Promise<Buffer> {

  //followed this instructions: https://github.com/Hopding/pdf-lib/issues/1183#issuecomment-2593629148
  //todo: embed fonts, results in error, but included pdf already has fonts embedded
  //validate pdf/a-3 compliance at:

  const base64Pdf = inputBuffer.toString('base64');

  // Define the PDF/A-3 options
  const options = {
    author: 'Your Name',
    title: 'My PDF/A-3 Document',
  };

  const doc = await PDFLibDocument.create();

  const pdfDoc = await PDFLibDocument.load(inputBuffer);
  const copiedPages = await doc.copyPages(pdfDoc, pdfDoc.getPageIndices());
  copiedPages.forEach((page) => {
    page.setTrimBox(0, 0, page.getWidth(), page.getHeight());
    doc.addPage(page);
  });
  const documentId = randomBytes(16).toString('hex');
  const id = PDFHexString.of(documentId);
  doc.context.trailerInfo.ID = doc.context.obj([id, id]);

  doc.registerFontkit(fontkit);

  const arimoFontPaths = {
    normal: __dirname + '/e-invoice/fonts/Arimo-Regular.ttf',
    bold: __dirname + '/e-invoice/fonts/Arimo-Bold.ttf',
    italic: __dirname + '/e-invoice/fonts/Arimo-Italic.ttf',
  };

  const aldotheApacheFontPaths = {
    normal: __dirname + '/e-invoice/fonts/AldotheApache.ttf',
    bold: __dirname + '/e-invoice/fonts/AldotheApache.ttf',
    italic: __dirname + '/e-invoice/fonts/AldotheApache.ttf',
  };

  // await Promise.all(
  //   [
  //     arimoFontPaths.normal,
  //     arimoFontPaths.italic,
  //     arimoFontPaths.bold,
  //     aldotheApacheFontPaths.normal,
  //     aldotheApacheFontPaths.italic,
  //     aldotheApacheFontPaths.bold,
  //   ].map(async (fontPath) => {
  //     await doc.embedFont(fs.readFileSync(path.resolve(fontPath)));
  //   })
  // );
  const iccBuffer = fs.readFileSync(path.join(__dirname, 'e-invoice/sRGB2014.icc'));
  const iccStream = doc.context.stream(iccBuffer, {
    Length: iccBuffer.length,
    N: 3,
  });

  const outputIntent = doc.context.obj({
    Type: 'OutputIntent',
    S: 'GTS_PDFA1',
    OutputConditionIdentifier: PDFString.of('sRGB'),
    DestOutputProfile: doc.context.register(iccStream),
  });
  const outputIntentRef = doc.context.register(outputIntent);
  doc.catalog.set(
    PDFName.of('OutputIntents'),
    doc.context.obj([outputIntentRef])
  );

  const author = 'John Doe';
  const producer = 'My PDF Producer';
  const creator = 'Invoice System';
  const title = 'Invoice Document';
  const creationDate = new Date();
  const modificationDate = new Date();

  doc.setAuthor(author);
  doc.setProducer(producer);
  doc.setCreator(creator);
  doc.setTitle(title);
  doc.setCreationDate(creationDate);
  doc.setModificationDate(modificationDate);

  //const base64PdfA3 = await makePDFA3(base64Pdf, options);
  const metadataXML = `
  <?xpacket begin="" id="${documentId}"?>
    <x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Adobe XMP Core 5.2-c001 63.139439, 2010/09/27-13:37:26">
    <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">

      <rdf:Description rdf:about="" xmlns:dc="http://purl.org/dc/elements/1.1/">
      <dc:format>application/pdf</dc:format>
      <dc:creator>
        <rdf:Seq>
        <rdf:li>${author}</rdf:li>
        </rdf:Seq>
      </dc:creator>
      <dc:title>
         <rdf:Alt>
          <rdf:li xml:lang="x-default">${title}</rdf:li>
         </rdf:Alt>
      </dc:title>
      </rdf:Description>

      <rdf:Description rdf:about="" xmlns:xmp="http://ns.adobe.com/xap/1.0/">
      <xmp:CreatorTool>${creator}</xmp:CreatorTool>
      <xmp:CreateDate>${creationDate.toISOString()}</xmp:CreateDate>
      <xmp:ModifyDate>${modificationDate.toISOString()}</xmp:ModifyDate>
      <xmp:MetadataDate>${creationDate.toISOString()}</xmp:MetadataDate>
      </rdf:Description>

      <rdf:Description rdf:about="" xmlns:pdf="http://ns.adobe.com/pdf/1.3/">
      <pdf:Producer>${producer}</pdf:Producer>
      </rdf:Description>

      <rdf:Description rdf:about="" xmlns:pdfaid="http://www.aiim.org/pdfa/ns/id/">
      <pdfaid:part>3</pdfaid:part>
      <pdfaid:conformance>B</pdfaid:conformance>
      </rdf:Description>
    </rdf:RDF>
    </x:xmpmeta>
  <?xpacket end="w"?>
  `.trim();

  const metadataStream = doc.context.stream(metadataXML, {
    Type: 'Metadata',
    Subtype: 'XML',
    Length: metadataXML.length,
  });
  const metadataStreamRef = doc.context.register(metadataStream);
  doc.catalog.set(PDFName.of('Metadata'), metadataStreamRef);

  doc.context.enumerateIndirectObjects().forEach(([ref, obj]) => {
    if (obj instanceof PDFDict) {
      const fontEntry = Array.from(obj.entries()).find(([key, value]) =>
        value.toString().includes('Font')
      );
      if (fontEntry) {
        obj.set(PDFName.of('CIDToGIDMap'), PDFName.of('Identity'));
      }
    }
  });


  //TODO create valid zugferd xml
  // TODO attach zugferd XML
  // this might help for the metadata: https://apryse.com/blog/pdfa-format/how-to-create-zugferd-valid-invoices-v2

  // await pdfDoc.attach(jpgAttachmentBytes, 'cat_riding_unicorn.jpg', {
  //   mimeType: 'image/jpeg',
  //   description: 'Cool cat riding a unicorn! 🦄🐈🕶️',
  //   creationDate: new Date('2019/12/01'),
  //   modificationDate: new Date('2020/04/19'),
  // })


  const buffer = Buffer.from(await doc.save());
  return buffer;
}
