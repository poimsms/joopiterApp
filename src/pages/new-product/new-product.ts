import { Component, ViewChild } from "@angular/core";
import { ImagePicker, ImagePickerOptions } from "@ionic-native/image-picker";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController
} from "ionic-angular";
import { AuthProvider } from "../../providers/auth/auth";
import { EjemploPage } from "../ejemplo/ejemplo";
import { ProductProvider } from "../../providers/product/product";

@IonicPage()
@Component({
  selector: "page-new-product",
  templateUrl: "new-product.html"
})
export class NewProductPage {
  imagePreview: any;
  base64Image = "";
  principalPreview: any;
  base64Principal = "";
  showKg = true;
  usuario = {};

  opt = "outfit";
  destacado = "";
  category = "";
  coleccion = "none";
  coleccionArray = [];

  collections = [];
  titulo = "";
  precio: number;
  pricePer = "";
  descripcion = "";
  descripcionFiltrada = "";
  imagenes = [];
  imagenesPreview = [];
  tallaColores = [];

  go =
    "iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";

  @ViewChild("myInput")
  myInput;
  constructor(
    public alertCtrl: AlertController,
    private navParams: NavParams,
    public navCtrl: NavController,
    private imagePicker: ImagePicker,
    private _product: ProductProvider,
    private _auth: AuthProvider
  ) {
    // this.fetchCollections();
  }
  openEjemplo() {
    this.navCtrl.push(EjemploPage);
  }
  newCollection() {
    const prompt = this.alertCtrl.create({
      title: "Colección",
      // message: "Enter a name for this new album you're so keen on adding",
      inputs: [
        {
          name: "title",
          placeholder: "Título"
        }
      ],
      buttons: [
        {
          text: "Cancelar",
          handler: data => {
            console.log("Cancel clicked");
          }
        },
        {
          text: "Guardar",
          handler: data => {
            this._product.addCollection(data.title, this._auth.authData);
            console.log("Saved clicked");
          }
        }
      ]
    });
    prompt.present();
  }
  fetchCollections() {
    this._product
      .getCollections(this._auth.authData)
      .subscribe(data => (this.collections = data));
  }
  onFileChanged(event) {
    const file = event.target.files[0];
    this.base64Image = file;
    this.base64Image = file;
    console.log("file", file);
  }
  addImg() {
    this.imagePreview = "data:image/jpeg;base64," + this.go;
    this.base64Image = this.go;
    this.imagenes.push(this.base64Image);
    this.imagenesPreview.push(this.imagePreview);
  }
  principal() {
    this.principalPreview = "data:image/jpeg;base64," + this.go;
    this.base64Principal = this.go;
  }
  resize() {
    var element = this.myInput[
      "_elementRef"
    ].nativeElement.getElementsByClassName("text-input")[0];
    var scrollHeight = element.scrollHeight;
    element.style.height = scrollHeight + "px";
    this.myInput["_elementRef"].nativeElement.style.height =
      scrollHeight + 16 + "px";
  }
  select_photo() {
    const options: ImagePickerOptions = {
      quality: 70,
      outputType: 1,
      maximumImagesCount: 1
    };
    this.imagePicker.getPictures(options).then(
      results => {
        for (var i = 0; i < results.length; i++) {
          this.imagePreview = "data:image/jpeg;base64," + results[i];
          this.base64Image = results[i];
        }
      },
      err => {
        console.log("ERROR en selector", JSON.stringify(err));
      }
    );
  }
  saveData() {
    if (this.coleccion != "none") {
      console.log(this.coleccion);
      this._product.updateCollection(this.coleccion);
    }
    this._product.addProduct(
      this.coleccion,
      this.titulo,
      this.precio,
      this._auth.authData
    );
  }
}
