# Node Express Template (With TS)

### <u><b>Description:</b></u>

<p>A basic template repository for Node JS (With Express JS and TypeScript) projects. Has some basic functionalities already set up, such as REST APIs and file upload handler.</p>

The project is fully set up with <a href="">Express JS</a> & <a href="https://www.typescriptlang.org/">TypeScript</a>

<p>The project uses a static json file to handle data, but a database connection functionality (Mongo DB) has been implemented and left <b>commented out</b> for those who may want to use it.</p>
<p>Packages that are required to run this include:</p>
<ol>
    <li>
<<<<<<< HEAD
=======
        <a href="https://www.npmjs.com/package/@prisma/client">@prisma/client</a>
    </li>
    <li>
>>>>>>> postgres
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
        <a href="https://www.npmjs.com/package/multer">multer</a>
    </li>
    <li>
        <a href="https://www.npmjs.com/package/multer">tsconfig-paths</a>
    </li>
</ol>
<span>Following are dev packages:</span>
<ol>
    <li>
<<<<<<< HEAD
        <a href="https://www.npmjs.com/package/@eslint/js">"@eslint/js"</a>
=======
        <a href="https://www.npmjs.com/package/@eslint/js">@eslint/js</a>
>>>>>>> postgres
    </li>
    <li>
        <a href="https://www.npmjs.com/package/@types/eslint__js">@types/eslint__js</a>
    </li>
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
    <li>
        <a href="https://www.npmjs.com/package/typescript-eslint">typescript-eslint</a>
    </li>
</ol>
<p><strong>Source folder architecture:</strong></p>

```
    src/
        config/
        controller/
        middleware/
        model/
        routes/
        service/
        utils/
        app.ts
```

<p>The following routes are already set up for demo purposes:</p>

```js
    1.  route: "/posts/all"
        method: "GET",
    2.  route: "/posts/detail/:id"
        method: "GET"
    3.  route: "/posts/create"
        method: "POST",
        payload: "body",
        body: {
            title: string,
            content: string,
            user_id: number
        }
    4.  route: "/posts/file"
        method: "POST",
        payload: "form-data",
        data:{
            my-file: file,
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

<<<<<<< HEAD
<li>Switch to the correct branch. The branch for the mongoose setup is called `mongoose`:</li>
, and the command will be:

```bash
git checkout mongoose
=======
<li>Switch to the correct branch. The branch for the postgres setup is called `postgres`:</li>
, and the command will be:

```bash
git checkout postgres
>>>>>>> postgres
```

<li>Install the necessary packages:</li>

```bash
npm install
```

<<<<<<< HEAD
<li>Navigate to the .env file. If you want a port of your choice to run the project on, set it up inside a .env file. This is the env value for port if you want to run it on port 8000:</li>

```env
PORT=8000
```

<li>Still at the .env file, you will need to set the connection string for your database. This is the connection string for mongodb running on localhost, and the database is named to_do_list:</li>

```env
DATABASE_URL=mongodb://127.0.0.1:27017/to_do_list
=======
<li>In the .env file, You will need to set the connection string for your database. This is the connection string for a postgresql database running on localhost, and the database is named to_do_list. Please take note of the username and password as it will be different for each user:</li>

```env
DATABASE_URL=postgres://[username]:[password]@localhost:5432/to_do_list
```

<li>Generate the prisma client:</li>

```bash
npx prisma generate
```

<li>Run the migration with this command:</li>

```bash
npx prisma migrate dev
```

<li>In the .env file. If you want a port of your choice to run the project on, set it up inside a .env file. This is the env value for port if you want to run it on port 8000:</li>

```env
PORT=8000
>>>>>>> postgres
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
