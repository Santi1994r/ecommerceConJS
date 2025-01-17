import { guardarCarritoEnStoraje, obtenerCarritoDeStoraje } from "./storaje.js";
import { todosLosProductos } from "./main.js";

let carrito = obtenerCarritoDeStoraje() || [];

let contadorDeCompras = document.getElementById("cantidadDeCompras");
contadorDeCompras.innerText = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);


const agregarProductoACarrito = (id) => {
  let productoAniadido = todosLosProductos.find((prod) => prod.id === id);
  let productosDelCarrito = carrito.find((prod) => prod.id === productoAniadido.id);
  if (productosDelCarrito) {
    productosDelCarrito.cantidad++;
    contadorDeCompras.innerText = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);
  } else {
    carrito.push(productoAniadido);
    contadorDeCompras.innerText = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);
  }
  imprimirProductosDelCarrito();
  guardarCarritoEnStoraje(carrito);
};

const eliminarProductoDelCarrito = (index) => {
  carrito[index].cantidad--;
  contadorDeCompras.innerText--;
  if (carrito[index].cantidad === 0) {
    carrito[index].cantidad = 1;
    carrito.splice(index, 1);
  }
  disableBtnPay();
  actualizarProductosEnCarrito(carrito);
  guardarCarritoEnStoraje(carrito);
};

const totalDeCompra = () => {
  const total = carrito.reduce((acc, elem) => acc + elem.precio * elem.cantidad, 0);
  return total;
};

const actualizarProductosEnCarrito = (carr) => {
  divContainer.innerText = "";
  carr.forEach((prod, index) => {
    const card = document.createElement("div");
    card.classList.add("col");
    card.innerHTML = `
        <div class="card w-100">
                  <img src="${prod.imagen}" class="w-100" alt="tu mundo digital">
                  <div class="card-body">
                    <h5 class="card-title h6 text-dark">${prod.descripcion}</h5>
                    <p class="text-dark h6">
                      Cantidad: <span>${prod.cantidad}</span>
                    </p>
                    <button type="button" class="btn btn-danger btn-sm offset-sm-4">Eliminar</button>
                  </div>
        </div>`;

    divContainer.append(card);
    card.querySelector("button").addEventListener("click", () => {
      Swal.fire({
        title: '¿Estas seguro/a de que quieres eliminar el producto?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si!'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            'Tu producto ha sido eliminado',
            '',
            'success'
          )
          eliminarProductoDelCarrito(index);  
        }
      })
      
    });
  });
};

//creo un div que contiene todas las card dentro del carrito
const productoDelCarrito = document.getElementById("productoDelCarrito");
const divContainer = document.createElement("div");
divContainer.classList.add("row");
divContainer.classList.add("row-cols-1");
divContainer.classList.add("row-cols-md-3");
divContainer.classList.add("g-3");

const imprimirProductosDelCarrito = () => {
  document.getElementById("buttonCarritoJS").addEventListener("click", () => {
    divContainer.innerText = "";
    productoDelCarrito.append(divContainer);
    carrito.forEach((prod, index) => {
      const card = document.createElement("div");
      card.classList.add("col");
      card.innerHTML = `
            <div class="card w-100">
                      <img src="${prod.imagen}" class="w-100" alt="tu mundo digital">
                      <div class="card-body">
                        <h5 class="card-title h6 text-dark">${prod.descripcion}</h5>
                        <p class="text-dark h6">
                          Cantidad: <span>${prod.cantidad}</span>
                        </p>
                        <button type="button" class="btn btn-danger btn-sm offset-sm-4">Eliminar</button>
                      </div>
            </div>`;

      divContainer.append(card);
      card.querySelector("button").addEventListener("click", () => {
        Swal.fire({
          title: '¿Estas seguro/a de que quieres eliminar el producto?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si!'
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire(
              'Tu producto ha sido eliminado',
              '',
              'success'
            )
            eliminarProductoDelCarrito(index);  
          }
        })
      });
    });
    disableBtnPay();
  });
};

const disableBtnPay = () => {
  let disableBtnPay = document.getElementById("disableBtnPay");
  disableBtnPay.addEventListener("click", areYouSure);
  carrito.length === 0
   ? disableBtnPay.classList.add("d-none")
   : disableBtnPay.classList.remove('d-none')
};

const areYouSure = () => {
  Swal.fire({
    title: 'Esta seguro/a de que quiere finalizar la compra?',
    text: "No podra volver atras",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Finalizar!'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({ 
        title:`Felicidades!\nTu compra se ha realizado con exito`,
        text: `El total de tu compra es de $${totalDeCompra()}`,
        icon: 'success'
      })
      soundPay();
      carrito.forEach((prod) => {
        prod.cantidad = 1;
      })
      emptyCart();
      disableBtnPay();
    }
  })
};

const emptyCart = () => {
  carrito = [];
  guardarCarritoEnStoraje([]);
  contadorDeCompras.innerText = 0;
  actualizarProductosEnCarrito(obtenerCarritoDeStoraje());  
};

const soundPay = () => {
  let sound = new Audio("../sound/cajaRegistradora.mp3");
  sound.volume = .8;
  sound.play();
};

imprimirProductosDelCarrito();

export { agregarProductoACarrito };
export { carrito };