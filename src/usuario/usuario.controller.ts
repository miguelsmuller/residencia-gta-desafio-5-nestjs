import { Controller, Post, Get, Put, Param, Res } from '@nestjs/common';
import { UsuarioService } from './usuario.service';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  async create(): Promise<void> {
    await this.usuarioService.save();
  }

  @Put('/order')
  list() {
    this.usuarioService.order();
  }

  @Get('/ranking')
  ranking() {
    return this.usuarioService.lista.length != 0
      ? this.usuarioService.lista
      : this.usuarioService.order();
  }

  @Get(':id')
  async detail(@Param('id') id, @Res() res) {
    const usuario = await this.usuarioService.getUserById(id);

    if (usuario) res.send(usuario);
    else res.status(404).send();
  }

  @Get('/nfirsts/:quant')
  async nfirsts(@Param('quant') quant) {
    if (this.usuarioService.lista.length != 0) {
      return this.usuarioService.nfirsts(quant);
    }

    await this.usuarioService.order();
    return this.usuarioService.nfirsts(quant);
  }
}
