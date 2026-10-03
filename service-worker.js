const CACHE_NAME = "sales-record-v1";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./manifest.json",
    "./icon-180.png"
];


self.addEventListener("install", function(event){

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then(function(cache){

                return cache.addAll(FILES_TO_CACHE);

            })

    );

    self.skipWaiting();

});


self.addEventListener("activate", function(event){

    event.waitUntil(

        caches.keys()
            .then(function(keys){

                return Promise.all(

                    keys.map(function(key){

                        if(key !== CACHE_NAME){

                            return caches.delete(key);

                        }

                    })

                );

            })

    );

    self.clients.claim();

});


self.addEventListener("fetch", function(event){

    event.respondWith(

        caches.match(event.request)
            .then(function(response){

                if(response){

                    return response;

                }


                return fetch(event.request)
                    .then(function(networkResponse){

                        return caches.open(CACHE_NAME)
                            .then(function(cache){

                                cache.put(
                                    event.request,
                                    networkResponse.clone()
                                );

                                return networkResponse;

                            });

                    });

            })
            .catch(function(){

                return caches.match("./index.html");

            })

    );

});
