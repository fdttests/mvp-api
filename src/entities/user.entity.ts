import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
    tableName: 'users',
    timestamps: false
})
export default class UserEntity extends Model {
    @PrimaryKey
    @Column({type: DataType.INTEGER, autoIncrement: true})
    declare id: number;

    @Column({ allowNull: false, type: DataType.STRING(155) })
    declare name: string;

    @Column({ allowNull: false, type: DataType.STRING(155) })
    declare email: string;

    @Column({ allowNull: false, type: DataType.STRING(100) })
    declare password: string;
}