# Node Express Template (With TS)

### <u><b>Description:</b></u>
 
<p>A basic template repository for Node JS (With Express JS and TypeScript) projects. Has some basic functionalities already set up for those scenarios that may need it.</p>

The project is fully set up with <a href="">Express JS</a> & <a href="https://www.typescriptlang.org/">TypeScript</a>
<p>The project uses a static json file to handle data, but a database connection functionality (Mongo DB) has been implemented and left <b>commented out</b> for those who may want to use it.</p>
<p>Packages that are required to run this include:</p>
<ol>
    <li>
        <a href="https://www.npmjs.com/package/body-parser">body-parser</a>
    </li>
    <li>
        <a href="https://www.npmjs.com/package/cors">cors</a>
    </li>
    <li>
        <a href="https://www.npmjs.com/package/dotenv">dotenv</a>
    </li>
    <li>
        <a href="https://www.npmjs.com/package/express">express</a>
    </li>
    <li>
        <a href="https://www.npmjs.com/package/express-validator">express-validator</a>
    </li>
    <li>
        <a href="https://www.npmjs.com/package/mongoose">mongoose</a>
    </li>
    <li>
        <a href="https://www.npmjs.com/package/multer">multer</a>
    </li>
    <span>Following are dev packages:</span>
    <li>
        <a href="https://www.npmjs.com/package/@types/bcryptjs">@types/bcryptjs</a>
    </li>
    <li>
        <a href="https://www.npmjs.com/package/@types/cors">@types/cors</a>
    </li>
    <li>
        <a href="https://www.npmjs.com/package/@types/express">@types/express</a>
    </li>
    <li>
        <a href="https://www.npmjs.com/package/@types/multer">@types/multer</a>
    </li>
    <li>
        <a href="https://www.npmjs.com/package/@types/node">@types/node</a>
    </li>
    <li>
        <a href="https://www.npmjs.com/package/nodemon">nodemon</a>
    </li>
    <li>
        <a href="https://www.npmjs.com/package/ts-node">ts-node</a>
    </li> 
    <li>
        <a href="https://www.npmjs.com/package/typescript">typescript</a>
    </li>
</ol>
<p><strong>Source folder architecture:</strong></p>

```
    src/
        config/
        controller/
        interfaces/
        middleware/
        model/
        routes/
        utils/
```

<p>The following routes are already set up for demo purposes:</p>

```js
    1.  route: "/users/get-users"
        method: "GET",
    2.  route: "/users/get-users/:id"
        method: "GET"
    3.  route: "/users/create-user"
        method: "POST",
        payload: "body",
        body: {
            firstName: string,
            lastName: string,
            phone: string,
            address: string,
            type: string,
            token: string
        }
    4.  route: "/users/file"
        method: "POST",
        payload: "form-data",
        data:{
            file: file,
        }
```

### <u><b>Setup:</b></u>
<ol>
<li>Clone the repository at first: </li>

```bash
git clone git@github.com:snigdho611/node-template.git
```
<li>Navigate into that directory:</li>

```bash
cd node-template
```
<li>Install the necessary packages:</li>

```bash
npm install 
```
<li>If you want a port of your choice to run the project on, set it up inside a .env file:</li>

```env
PORT=5000
```

<li>Run the project in dev using:</li>

```node
npm run dev
```
</ol>


<p style="font-size: 13px">
<u><b>Author:</b></u>
<a href="https://github.com/snigdho611">Snigdho Dip Howlader</a>
</p>
