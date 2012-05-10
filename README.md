# Install
Remember to have a proper PATH setup with support for binaries installed in ./node_modules.
Do so by adding:

    export PATH="./node_modules/.bin:$PATH"
    
to your environment configuration files (eg: ~/.bashrc).

    $ npm install
    $ blacksmith generate && blacksmith preview

Access [http://localhost:8080](http://localhost:8080).

See [https://github.com/flatiron/blacksmith](https://github.com/flatiron/blacksmith) for more info

# Edit

Each directory under pages is a page composed by a content.md and a page.json file.

Before deploying, run blacksmith generate to generate the static files under public/

To edit the layout: edit the file theme/article.html.

If you edit any of these you will need to restart the server.

CSS: theme/css/lxjs.css
