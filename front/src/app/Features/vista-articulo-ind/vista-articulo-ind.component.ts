import { Component, OnInit } from '@angular/core';
import { vistaArtIndServ } from 'src/app/core/services/vista-art-ind-serv.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vista-articulo-ind',
  templateUrl: './vista-articulo-ind.component.html',
  styleUrls: ['./vista-articulo-ind.component.css']
})
export class VistaArtIndComponent implements OnInit {

  //id del producto
  id: number = 1;

  //id del usuario
  idUsuario: number = 0;
  
  //seleccionables
  envSel: string = '';
  env: string = '';
  envBol: boolean = false;

  diasSel: string = '';
  dias: string = '';

  pagoSel: string = '';
  pago: string = '';
  pagoBol: boolean = false;

  //traer datos
  respuesta: any = [];

  //estados logueo
  logeadoComprador: boolean = false;
  logeadoVendedor: boolean = false;
  logeadoVendedorProd: boolean = false;
  
  

  constructor(private service: vistaArtIndServ, private router: Router) { }

  ngOnInit(): void {
    this.datosProd(this.id);
    this.corroborarLogeo();
    this.corroborarVendedor();
  }


  //traer datos
  datosProd(id: number) {
    this.service.datosProdServ(this.id).subscribe(res => {
      this.respuesta = res;
    })
  }


  //corroborar logueos
  corroborarLogeo() {    
    let infoLocal = localStorage.getItem('resLog')
    if (infoLocal) {
      let newObject = JSON.parse(infoLocal);
      if (newObject) {
        if (newObject[1].users.estadoDeVendedor) {
          this.logeadoVendedor = true;
          this.logeadoComprador = false;
          this.idUsuario = newObject[1].users.id;
        } 
        else if (!newObject[1].users.estadoDeVendedor) {
          this.logeadoComprador = true;
          this.logeadoVendedor = false;
          this.idUsuario = newObject[1].users.id;
          
        }          
        else {
          this.logeadoComprador = false;
          this.logeadoVendedor = false;
        }
      }
    }
  }

  corroborarVendedor() {
    let infoLocal = localStorage.getItem('resLog')
    if (infoLocal) {
      let newObject = JSON.parse(infoLocal);
      if (newObject) {
        if (newObject[1].users.id == this.id) {
          this.logeadoVendedorProd = true;
        }
      }
    }
  }


  //mensaje de alerta
  mensajeDias() {
    alert("Tanto para envío como para retiro tendrá su producto en un plazo de 2 días");    
  }


  //seleccionables
  capturarEnvio() {
    this.env = this.envSel;
    console.log(this.env)
    if (this.env == "envio") {
      this.envBol = true;
    }
  }

  capturarDias() {
    this.dias = this.diasSel;
  }

  capturarPago() {
    this.pago = this.pagoSel;
    if (this.pago == "tarjeta") {
      this.pagoBol = true;
    }
  }

  
  //confirmación
  botAlq() {
    if(confirm("¿Desea pasar a la vista de transacción?")) { 
      const datosAlq = {
        idProd: this.id,
        idAlq: this.idUsuario,
        envio: this.envBol,
        dias: (Number(this.dias)) + 1,
        pago: this.pagoBol,
      }
      localStorage.setItem('datosAlq', JSON.stringify(datosAlq));
    }
    //redirigir a la pantalla de confirmar la transacción
  }  
}