
import { Get, Controller, Render } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Render('index')
  root() {
    return { title: 'SolidarianID', message: 'Bienvenido a SolidarianID' };
  }

  @Get('validation')
  @Render('validation')
  validation() {
    return { title: 'Validación', viewName: 'validation' };
  }

  @Get('statistics')
  @Render('statistics')
  statistics() {
    return { title: 'Estadísticas', viewName: 'statistics' };
  }

  @Get('information')
  @Render('information')
  information() {
    return { title: 'Informes', viewName: 'information' };
  }

}
