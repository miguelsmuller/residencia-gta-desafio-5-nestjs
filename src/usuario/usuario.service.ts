import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Usuario } from './usuario.entity';

@Injectable()
export class UsuarioService {
  public lista = [];

  constructor(
    @InjectRepository(Usuario)
    private repository: Repository<Usuario>,
  ) {}

  async save() {
    const listUsuariosBrutos = this.generateCollectionUsuarios();
    const listUsuariosComoRepositorio = [];

    listUsuariosBrutos.forEach((usuario) => {
      listUsuariosComoRepositorio.push(this.repository.create(usuario));
    });

    await listUsuariosComoRepositorio.forEach((repository) => {
      this.repository.save(repository);
    });
  }

  async order() {
    const ranking = await this.repository.find({
      order: { score: 'DESC', username: 'ASC' },
    });

    this.lista = [];
    ranking.forEach((element, i) => {
      this.lista.push({
        ...element,
        ranking: i + 1,
      });
    });

    return this.lista;
  }

  nfirsts(quant: number) {
    return this.lista.slice(0, quant);
  }

  async getUserById(id: number) {
    const ranking = await this.repository.findOneBy({
      id: id,
    });
    return ranking;
  }

  generateRandomInteger() {
    return Math.floor(Math.random() * 99999) + 1;
  }

  generateCollectionUsuarios() {
    const usuarios = [];

    for (let _i = 0; _i < 100; _i++) {
      const score = this.generateRandomInteger();
      const usuario = {
        username: `user-${_i}`,
        score: score,
      };
      usuarios[_i] = usuario;
    }

    return usuarios;
  }
}
