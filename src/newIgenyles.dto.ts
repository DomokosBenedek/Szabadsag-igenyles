import { IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class NewIgenylesDto {
  @IsNotEmpty({ message: 'A név mező kitöltése kötelező!' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'A kezdő dátum kitöltése kötelező!' })
  @IsDateString({}, { message: 'A kezdő dátumnak érvényes dátumnak kell lennie!' })
  startDate: string;

  @IsNotEmpty({ message: 'A vég dátum kitöltése kötelező!' })
  @IsDateString({}, { message: 'A vég dátumnak érvényes dátumnak kell lennie!' })
  endDate: string;

  @IsOptional()
  @IsBoolean()
  paidLeave?: boolean;

  @IsNotEmpty({ message: 'Az alkalmazott azonosító kitöltése kötelező!' })
  @Matches(/^[A-Z]{3}-[1-9]{3}$/, { message: 'Az alkalmazott azonosító formátuma hibás! (Pl.: BBB-123)' })
  employeId: string;

  @IsNotEmpty({ message: 'Az indoklás mező kitöltése kötelező!' })
  @IsString()
  @MinLength(30, { message: 'Az indoklásnak legalább 30 karakter hosszúnak kell lennie!' })
  reason: string;
}
