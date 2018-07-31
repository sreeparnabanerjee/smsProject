import {Column, Entity, Index, JoinColumn, OneToMany, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Sms {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", { length: 16 })
    @Index("from")
    from: string;

    @Column("varchar", { length: 16 })
    @Index("to")
    to: string;

    @Column("varchar", { length: 120 })
    text: string;

    @Column("timestamp")
    @Index("timeStampGmt")
    timeStampGmt: string | number;

}