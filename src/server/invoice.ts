import * as fluentreports from 'fluentreports';

var Report = fluentreports.Report;

import express, { Router } from 'express';
import { api } from './api';
import { Invoice } from '../shared/entities/invoice';
import { repo } from 'remult';
import { InvoiceItem } from '../shared/entities/invoice-item';

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
  const buffer = await renderInvoice(invoice);
  res.setHeader('Content-Type', 'application/pdf');
  res.send(buffer);
});

function formatCurrency(value: number) {
  return value.toFixed(2) + ' EUR';
}

function formatDate(date: Date) {
  return date.toLocaleDateString();
}

export async function renderInvoice(invoice: Invoice): Promise<Buffer> {
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
    x.band([], { y: 120 });

    x.band([{ data: 'Absende GbR - Hauptstr. 1 - 12345 Köln', width: 300 }], {
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

  // To Keep fonts rendered identically on all test machines, we are setting the default
  // Font to be "Arimo" which is close to the normal default "Helvetica" font.
  var report = new Report('buffer', { font: 'Arimo' }).data(primary_data);
  report.registerFont('Arimo', {
    normal: __dirname + '/Fonts/Arimo-Regular.ttf',
    bold: __dirname + '/Fonts/Arimo-Bold.ttf',
    italic: __dirname + '/Fonts/Arimo-Italic.ttf',
  });

  // Normally you would register a different font for each normal, bold, and italic; but for space size we are registering the same font for all three
  report.registerFont('AldotheApache', {
    normal: __dirname + '/Fonts/AldotheApache.ttf',
    bold: __dirname + '/Fonts/AldotheApache.ttf',
    italic: __dirname + '/Fonts/AldotheApache.ttf',
  });

  var r = report.margins(20).detail(detail);

  report
    .groupBy('no')
    .header(proposalHeader)
    .footer(proposalFooter)
    .groupBy('product.product_type')
    .sum('amount')
    .footer(tableFooter);

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
