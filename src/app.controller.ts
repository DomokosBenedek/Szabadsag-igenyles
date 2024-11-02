import { Body, Controller, Get, Post, Render, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { NewIgenylesDto } from './newIgenyles.dto';
import { Response } from 'express';
import { IgenylesDto } from './Igenyles.dto';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello() {
    return {
      message: this.appService.getHello()
    };
  }

  requests = [];

  @Get('newKerelem')
  @Render('newKerelemForm')
    getKerelmek(){
      return{  
        errors: [], 
        formData: {
          name: "",
          startDate: "",
          endDate: "",
          paidLeave: false,
          employeId: "",
          reason: "",
          }};
    }
  
  
  
  @Post('newKerelem')
  @Render('success')
    newKerelem(
    @Body() IgenylesData: NewIgenylesDto, 
    @Res() response: Response) {
    const errors: string[] = [];
    console.log(IgenylesData)

    const newIgenyles:IgenylesDto = {
      name: IgenylesData.name,
      startDate: IgenylesData.startDate,
      endDate: IgenylesData.endDate,
      paidLeave: IgenylesData.paidLeave === "true",
      employeeId: IgenylesData.employeeId,
      reason: IgenylesData.reason
    }
    console.log(newIgenyles)

    if (!IgenylesData.name || !IgenylesData.startDate || !IgenylesData.endDate || !IgenylesData.employeeId || !IgenylesData.reason) {
      errors.push('Minden (*) kötelező mezőt meg kell adni!');
    }
    console.log(newIgenyles.employeeId)
    if (!/^[A-Z]{3}-[1-9]{3}$/.test(newIgenyles.employeeId)) {
      errors.push('Az alkalmazott azonosító nem megfelelő formátumú! (BBB-SSS)');
    }

    if (new Date(IgenylesData.startDate) >= new Date(IgenylesData.endDate)) {
      errors.push('A kezdő dátumnak korábbinak kell lennie a vég dátumnál!');
    }

    if (IgenylesData.reason.length < 30) {
      errors.push('Az indoklásnak minimum 30 karaktert kell tartalmaznia.');
    }

    if(errors.length > 0){
      response.render('newKerelemForm', {
        errors,
        formData: IgenylesData
      })
      return errors;  
    }

    this.requests.push(IgenylesData);

    return response.redirect(303, '/requestSuccess');
  }

  
  @Get('requestSuccess')
  @Render('success')
  requestSuccess() {
    return {
      requests: this.requests.length,
    };
  }

}
