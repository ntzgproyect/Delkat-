import { Component, OnInit } from '@angular/core';
import { EditarUsuarioService } from 'src/app/core/services/editar-usuario.service';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.css']
})
export class EditarUsuarioComponent implements OnInit {

  idUser: string = '';

  corReg: string = '';
  pasReg: string = '';
  aliReg: string = '';
  nomReg: string = '';
  apeReg: string = '';
  dniReg: string = '';
  proReg: string = '0';
  locReg: string = '0';
  dirReg: string = '';

  listprovincias: any[] = [];
  listlocalidades: any[] = [];
  mensajeRegistro: string = '';

  constructor(private service: EditarUsuarioService, private mensajeService: MensajeService, private router: Router) { }

  ngOnInit(): void {
    this.getIdUsuario()
    
    this.service.getProvincias().subscribe(provincias => {this.listprovincias = provincias});
  }

  
  actualizarLocalidades() {
    this.service.getLocalidades(this.proReg).subscribe(localidades => {this.listlocalidades = localidades});
  }
  
  botReg() {
    if (this.corReg && this.pasReg && this.aliReg && this.nomReg && this.apeReg && this.dniReg && this.proReg && this.locReg && this.dirReg) {
      console.log(this.corReg + this.pasReg);
      this.service.modificarUsuario(
        this.corReg,
        this.pasReg,
        this.aliReg,
        this.nomReg,
        this.apeReg,
        this.dniReg,
        this.locReg,
        this.dirReg,
        this.idUser
      ).subscribe(respuesta => {
        console.log(respuesta);
        this.mensajeService.mensajeRegistro('Se han guardado sus cambios.');
        this.router.navigate(['home-page']);
      });
    } else {
      this.mensajeService.mensajeRegistro('Campos incompletos. Por favor, complete todos los campos.');
    }
  }

  getIdUsuario() {    
    let infoLocal = localStorage.getItem('resLog')
    if (infoLocal) {
      let newObject = JSON.parse(infoLocal);
      if (newObject) {
        this.idUser = newObject[1].users.id
        console.log(this.idUser);
        
      }
    }
  }

  eliminarCuenta() {
    if (confirm("¿Desea eliminar su cuenta? Al confirmar no podrá recuperar sus datos. Esta acción no se puede deshacer")) {
      console.log("Id User: " + this.idUser);
  
      const idNumber: number = +this.idUser;
  
      this.service.eliminarUsuario(idNumber).subscribe((resEli: any) => {
        console.log("Res eli: " + resEli);
        if (resEli) {
          console.log("Res eli: " + resEli);
          alert("Cuenta eliminada con éxito");
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/']).then(() => { });
          });
        } else {
          alert("No se ha podido eliminar su cuenta");
        }
      });
    }
  }
  
  




}