self.addEventListener('install', function (e: Event): void {
    // @ts-ignore
    (e as ExtendableEvent).waitUntil(caches.open('bicycle-test').then(function (cache) {
        return cache.addAll([
            '/',
            '/index.html',
            '/favicon.ico',
            '/script/lib/require.min.js',
            '/script/lib/handlebars.runtime.min.js',
            '/script/ui-component.js',
            '/script/app.js',
            '/handlebars/app.hbs.js',
            '/script/navbar.js',
            '/handlebars/navbar.hbs.js'
        ]);
    }));
});

self.addEventListener('fetch', function (e) {
    // @ts-ignore
    console.log(e.request.url);
    // @ts-ignore
    e.respondWith(caches.match(e.request).then(function (response) {
        // @ts-ignore
        return response || fetch(e.request);
    }));
});