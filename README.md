# Shopping Website


#### <div align="center">Try It Here</div>
#### <div align="center">https://educated-kettle.surge.sh/</div>

<br>
This website is a sample shopping website that user can register on this website, view the products and purchase it online.
Please use the following account and test card number from stripe to play around the website!

Username: testuser

Password: password

Stripe test card number: 4242424242424242  
CVC: Any 3 digits
DATE: Any future date

#### User Flow
***
Register
1. User can click on sign up link from nav bar to show sign up form.
2. Fill out the sign up form and click submit button.

Purchase
1. Once logged in, user can view products on the shop page, and click Add to cart button to add items.
2. In the Add to cart button, select the amount of products to purchase and click order.
3. All added items will be shown in the shopcart page. Users can see it by clicking the Shop Cart icon in the nav bar.
4. In the Shop Cart page, user can edit and remove the ordered item.
5. When user is ready to purchase, click on the Purchase button to redirect to stripe page.
6. On the stripe page, enter stripe test card number to process payments.
7. After purchase, user will redirect to a success page, and redirect again back to shop page.

#### API LIST
***
[Stripe API](https://stripe.com/docs/api)

#### Technologies Used
***
* [Javascript](https://www.javascript.com/)
* [Visual Studio Code](https://code.visualstudio.com/)
* [Fly](https://fly.io/)
* [Surgh](https://surge.sh/)

#### Libraries Used
***
node.js, React.js, Postgresql, Bootstrap, React-Bootstrap, React-toastify, font-awesome, Bcrypt, cors, dotenv, express, jsonschema, jsonwebtoken, axios, ngrok.

#### Developments
***
To run the site locally, please clone the repository first:
   git clone https://github.com/aidenhe86/Shopping-website.git

After clone the repository, please see README in client/server folder for more instructions.