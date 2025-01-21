
import {Entity, Fields} from 'remult';
import { repo } from 'remult';

@Entity('user',{
  allowApiCrud: true,
})
/**
 * Represents a user entity.
 */
export class User {
  /**
   * Hashes the given password.
   * @param password - The password to hash.
   * @returns A promise that resolves to the hashed password.
   */
  static hash = async (password: string) => password;

  /**
   * The unique identifier of the user.
   */
  @Fields.cuid()
  id!: string;

  /**
   * The name of the user.
   */
  @Fields.string()
  name = '';

  /**
   * The password of the user.
   * @remarks This field is excluded from API responses.
   */
  @Fields.string({ includeInApi: false })
  password = '';

  /**
   * The password used for updating the user's password.
   */
  @Fields.string<User>({
    serverExpression: () => '',
    saving: async (user, fieldRef, e) => {
      if (fieldRef.valueChanged()) {
        user.password = await User.hash(user.updatePassword);
      }
    }
  })
  updatePassword = '';

  /**
   * Indicates whether the user is active.
   */
  @Fields.boolean()
  active = true;

  /**
   * Indicates whether the user is an admin.
   */
  @Fields.boolean()
  isAdmin = false;
}


export async function bootstrapFirstAdminUser() {
  //check if user admin exists:
 const count = await repo(User).count();
  if (count == 0) {
    //create admin user
    let u = new User();
    u.isAdmin = true;
    u.name = 'admin';
    u.password = await User.hash('admin');
    await repo(User).save(u);
  }

}
