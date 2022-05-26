Live Site Link [useTools](https://manufacturer-website-11d73.web.app/).

## All Features
> This website is all about whole sell (Tools) business website like alibaba. The main concept of this website is, Customer can buy product from minimum quantity to available quantity. To buy any product, Customer have to register in this website then they can buy. In Home page Customer can see some product in tools section. every product contain name, image, short description, min order quantity, available quantity, price and a button named Buy now. when user click on the buy button then this product will show in purchase route or page ( if the customer logged in otherwise it will redirect to login page ) with all product details. In Purchase page user can change quantity (increase/decrease). The Initial value of quantity is the minimum order quantity. user can not able to reduce the quantity below the minimum order quantity and also user can not able to set quantity which is higher than the available quantity. In purchase page user also see delivery info field like phone, address. user have to filled that info to purchase the order. there have a button name Purchase now. if user click on that button, user see a successful message 'You order is successfully added, Please pay for this product from my order page. when user logged in he will see a dashboard. In Dashboard, user can see his profile section, My Order section,Add Review Section. In My Order section, User can see pay or cancel button with his every order. user can pay for his particular order from this page. user can only pay this order with Stripe payment system. In Add review page, user can see or add this review, user profile section user can see his info. One the other hand, This website have admin section, normal user can not see admin info as well as admin can not see customers info. admin can manage, add product. also can handle ann orders.' 

* ALL Product/Tools API with JWT: I have created an api to get all products with JWT verify. means un authorize user can not access the API.

* Single Product/Tool API by id with JWT: I have created an api to get single product by id with JWT verify. means un authorize user can not access the API.

* ALL Orders API by email with JWT: I have created an api to get all orders by email with JWT verify. means un authorize user can not access the API.

* POST user: I have created an api to POST a user with JWT. means un authorize user can not login.

* POST Order: I have created an api to POST order review with JWT.
