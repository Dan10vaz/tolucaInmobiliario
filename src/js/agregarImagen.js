import { Dropzone } from "dropzone";

const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

Dropzone.options.imagen = {
    dictDefaultMessage: "Arrastra las imagenes aquí",
    acceptedFiles: ".jpg, .jpeg, .png",
    maxFilesize: 10,
    maxFiles: 30,
    parallelUploads: 30,
    autoProcessQueue: false,
    addRemoveLinks: true,
    dictRemoveFile: 'Eliminar',
    dictMaxFilesExceeded: 'El limite es 30 fotos',
    headers: {
        'CSRF-Token': token
    },
    paramName: 'imagen'
}