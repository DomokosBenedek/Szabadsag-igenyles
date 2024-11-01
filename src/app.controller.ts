import { Body, Controller, Get, Post, Render, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { NewIgenylesDto } from './newIgenyles.dto';
import { Response } from 'express';


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

  private requests = [];

  @Get('newKerelem')
  @Render('newKerelemForm')
    getKerelmek(){
      return{  
        errors: {}, 
        formData: {} };
    }
  
  
  
  @Post('newKerelem')
  @Render('success')
    newKerelem(
    @Body() IgenylesData: NewIgenylesDto, 
    @Res() response: Response) {
    const errors: string[] = [];

    const newIgenyles = {
        name: IgenylesData.name,
        startDate: IgenylesData.startDate,
        endDate: IgenylesData.endDate,
        paidLeave:IgenylesData.paidLeave,
        employeId: IgenylesData.employeId,
        reason: IgenylesData.reason
      }

    if (!IgenylesData.name || !IgenylesData.startDate || !IgenylesData.endDate || !IgenylesData.employeId || !IgenylesData.reason) {
      errors.push('Minden (*) kötelező mezőt meg kell adni!');
    }

    if (!/^[A-Z]{3}-[1-9]{3}$/.test(newIgenyles.employeId)) {
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
        data: IgenylesData
      })
      return;
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
