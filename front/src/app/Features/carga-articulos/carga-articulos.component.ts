import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { CargaArticulosService } from 'src/app/core/services/carga-articulos.service';
import { BarraService } from 'src/app/core/services/barra.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-carga-articulos',
  templateUrl: './carga-articulos.component.html',
  styleUrls: ['./carga-articulos.component.css']
})
export class CargaArticulosComponent implements OnInit {
/*
  catReg: string = '0';
  nomReg: string = '';
  desReg: string = '';
  preReg: string = '';
  envReg: string = '';
  idUser: string = '';
  imgReg: any[] = [];
  */

  idUser: string = '';
  confVendedor: boolean = false;
  mensajeRegistro: string = '';
  listcategorias: any[] = [];
  uploadedImages: string[] = [];
  idProducto: string = '';
  images: any = [];

  constructor(private service: CargaArticulosService, private router: Router, private mensajeService: MensajeService, private barraService:BarraService, private formBuilder: FormBuilder) { }

  formUp = this.formBuilder.group({
    'catReg': ['0', Validators.required],
    'nomReg': ['', Validators.required],
    'desReg': ['', Validators.required],
    'preReg': ['', Validators.required],
    'envReg': ['0', Validators.required],
    'images': ['', Validators.required],
  });

  ngOnInit(): void {

    this.getIdUser();

    this.barraService.getCategories().subscribe(categorias => {this.listcategorias = categorias});

  }

  subirProducto(): void { 
    //if (this.formUp.get('catReg')?.value && this.formUp.get('nomReg')?.value && this.desReg && this.preReg && this.envReg) {
      this.service.carga(
        this.formUp.get('catReg')?.value,
        this.formUp.get('nomReg')?.value,
        this.formUp.get('desReg')?.value,
        this.formUp.get('preReg')?.value,
        this.formUp.get('envReg')?.value,
        this.idUser
      ).subscribe(respuesta => {
        console.log(respuesta);
        if(respuesta){
          this.idProducto = respuesta.id;
          console.log(this.idProducto)
          this.subirImages();
        }
        this.mensajeService.mensajeRegistro('Articulo cargado con éxito.');
        this.router.navigate(['home-page']);
      });

      /*
    } else {
      this.mensajeService.mensajeRegistro('Campos incompletos. Por favor, complete todos los campos.');
    }
    */
  }

  subirImages() {

      const formData = new FormData();

      for(let img of this.images){
        formData.append('images', img);
      }

      this.service.cargaFiles(formData).subscribe(res => {
        console.log(res);
        if(res){
          for (let i = 0; i < res.length; i++) {
            const imageName = res[i].originalname;
            this.service.cargaImagesNames(this.idProducto, imageName).subscribe( res =>
              console.log(res));
          }
        }  
      })
      console.log('carga exitosa de imagenes');
    }


  onFileSelected(event: any): void {
    
    //dejar de visualizar las imagenes cuando suba otra
    const files = event.target.files;
    this.images = files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.readAsDataURL(file);

          reader.onload = () => {
            this.uploadedImages.push(reader.result as string);
          };
        }
      }
    }
  }

  getIdUser() {    
    let infoLocal = localStorage.getItem('resLog')
    if (infoLocal) {
      let newObject = JSON.parse(infoLocal);

      const idUser = newObject[1].users.id;
      this.idUser = idUser;
      console.log(this.idUser)

      const vendedor = newObject[1].users.estadoDeVendedor;
      if (vendedor){
        this.confVendedor = true;
      }
    }
  }

}