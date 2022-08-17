(function () {
    const lat = document.querySelector('#lat').value || 19.2718459;
    const lng = document.querySelector('#lng').value || -99.6513658;
    const mapa = L.map('mapa').setView([lat, lng], 13);
    let marker;
    //utilizar provider y geocoder para obtener la dirección
    const geocodeService = L.esri.Geocoding.geocodeService();

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    //El pin
    marker = new L.marker([lat, lng], {
        draggable: true,
        autoPan: true
    })
        .addTo(mapa)

    //Detectar el movimiento del pin
    marker.on('moveend', function (e) {
        marker = e.target;
        const posicion = marker.getLatLng();
        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng));
        //Obtener la informacion de las calles al soltar el pin
        geocodeService.reverse().latlng(posicion, 13).run(function (error, resultado) {
            /* console.log(resultado); */
            marker.bindPopup(resultado.address.LongLabel).openPopup();
            //llenar los campos
            document.querySelector('.calle').textContent = resultado?.address?.LongLabel ?? '';
            document.querySelector('#calle').value = resultado?.address?.LongLabel ?? '';
            document.querySelector('#lat').value = resultado?.latlng.lat ?? '';
            document.querySelector('#lng').value = resultado?.latlng?.lng ?? '';
        });
    })
})()