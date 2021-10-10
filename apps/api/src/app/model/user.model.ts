import { Column, Model, PrimaryColumn } from '@gradii/fedaco';

export class User extends Model {
  _fillable = ['email']

  @PrimaryColumn()
  id;

  @Column()
  email;
}
