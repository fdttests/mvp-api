import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import UserEntity from "./user.entity";

@Table({
    tableName: 'tasks',
    timestamps: false
})
export default class TaskEntity extends Model {
    @PrimaryKey
    @Column({ type: DataType.INTEGER, autoIncrement: true })
    declare id: number;

    @Column({ allowNull: false, type: DataType.STRING(155) })
    declare name: string;

    @Column({ allowNull: false, type: DataType.STRING(500) })
    declare description: string;

    @Column({ allowNull: false, type: DataType.STRING(30) })
    declare status: string;

    @BelongsTo(() => UserEntity)
    declare user: UserEntity;

    @ForeignKey(() => UserEntity)
    @Column({ allowNull: false, type: DataType.INTEGER })
    declare user_id: number;
}