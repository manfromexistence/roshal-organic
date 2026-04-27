Previously this was quadra edms project but now I am using this as a template and createing roshal-organic project - So you have to do these:
1. Use inline wsl with turso db to crate a new project called roshal-organic and put those env in our env files
2. In the auth we have to introduce admin and user role nothing more and previoulsy it was only a dashboard but now for marketting I have added some page and compoents so please by default on the / page please use that and the marketting has the about and other pages so from the dashboard remove those pages or else pages will clash with each other

The whole point of using this templete was for its good dashboard - and this is a cms like ecoumernce project - like all the marketing pages should controllable by the dashboard and also dashboard will also do its job of managing the products, orders, and users. So please make sure to set up the roles properly and ensure that the admin has access to all the functionalities while the user role has limited access based on their needs.

And these are more details on our current roshal-organic project:
It will have 2 bangla and english language support

🌿 Roshal Organic – পরিচিতি
Roshal Organic একটি প্রাকৃতিক ও স্বাস্থ্যসম্মত খাদ্য ব্র্যান্ড, যেখানে আমরা চেষ্টা করি মানুষের কাছে পৌঁছে দিতে সম্পূর্ণ খাঁটি ও অর্গানিক খাবার। আমাদের লক্ষ্য হলো রাসায়নিকমুক্ত, ভেজালহীন এবং স্বাস্থ্যকর খাবার সরবরাহ করা, যা মানুষের দৈনন্দিন জীবনে সুস্থতা ও শক্তি যোগায়।

আমরা বিশ্বাস করি—প্রকৃতির কাছ থেকে পাওয়া খাবারই সবচেয়ে নিরাপদ ও পুষ্টিকর। তাই Roshal Organic এ আমরা দেশি কৃষক ও প্রাকৃতিক উৎস থেকে সংগ্রহ করা পণ্য নিয়ে কাজ করি, যেমন অর্গানিক ফল, মধু, ঘি, গুড়, তেল ও অন্যান্য প্রাকৃতিক খাদ্য।

🌱 আমাদের লক্ষ্য
মানুষকে স্বাস্থ্যকর জীবনযাপনে উৎসাহিত করা এবং অর্গানিক খাদ্যের প্রতি আস্থা তৈরি করা।
🌾 আমাদের প্রতিশ্রুতি

* ১০০% খাঁটি ও প্রাকৃতিক পণ্য
* কোনো প্রিজারভেটিভ বা কেমিক্যাল নেই
* সরাসরি কৃষক ও প্রাকৃতিক উৎস থেকে সংগ্রহ
* গ্রাহকের…
[10:52 pm, 23/04/2026] +880 1719-403627: 🌿 Roshal Organic – খাঁটি স্বাদের আসল ঠিকানা! 🍯🥭

আপনি কি নিশ্চিত আপনার খাওয়া মধু, আম বা গুড় সত্যিই খাঁটি? 🤔
আজকাল বাজারে ভেজালের ভিড়ে আসল জিনিস খুঁজে পাওয়া কঠিন!
তাই আমরা নিয়ে এসেছি—
✅ ১০০% প্রাকৃতিক
✅ কোনো কেমিক্যাল নেই
✅ সরাসরি গ্রাম থেকে সংগ্রহ
✅ টেস্টে আসল, বিশ্বাসে অটুট
🍯 খাঁটি মধু
🥭 মৌসুমী আম
🍯 দেশি গুড়
🥛 ফ্রেশ দই
👉 আপনার পরিবারের জন্য সেরা পছন্দ Roshal Organic
🔥 আজই অর্ডার করুন – সীমিত স্টক!
#RoshalOrganic #OrganicFood #HealthyLife #PureFood #Bangladesh

Always use shadcn-ui components and please make the whole website responsive and update routes to be like the ecommerce like product listing page, product details page, cart page, checkout page, order history page and user profile page. Also make sure to implement the admin dashboard with functionalities to manage products, orders and users effectively. Like make the marketting pages (about, contact, etc.) manageable from the dashboard as well so that we can easily update the content without needing to change the code. Also put ability to change ui of marketting pages from the dashboard as well so that we can easily update the look and feel of those pages without needing to change the code. I mean the content like text, imagees, and also the layout of the marketting pages should be manageable from the dashboard. This way we can keep our marketing content fresh and engaging without needing to involve developers for every update. And for now only run format - lint and tsx commands no need to run build or dev or dx flow

------------------------------------------------------------------------------------------------------------------

Now in here for payment and checkout please use cards, bkash, nagad, and rocket as payment options. Make sure to integrate these payment gateways properly and ensure a smooth checkout experience for the users. Also, implement order tracking functionality so that users can easily track their orders from the dashboard. And also put bkash, nagad, rocker payment screenshot way so that even we don't integrate real bkash gateway we can still show the users how to make payment through bkash, nagad, and rocket by providing them with a screenshot guide on the checkout page. This way we can still provide a seamless payment experience for our users while we work on integrating the real payment gateways in the future. And for this features to our dashboard, please create a section where we can manage the payment options and also upload the screenshots for bkash, nagad, and rocket payment guides. This way we can easily update the payment options and guides from the dashboard without needing to change the code. So admin can check if the payment is legitimate so the temporary until we integrate the real payment gateways, we can have a manual verification process where the admin can check the payment details and mark the order as paid once they verify the payment. This way we can still manage orders effectively while we work on integrating the real payment gateways in the future.

------------------------------------------------------------------------------------------------------------------

Now please work on our marketing pages so that in the marketing pages all the content, text, and images are controllable via the admin dashboard pages, like a CMS project. Make sure that in our marketing pages the product listing is properly showing correctly, and search and filter are also like ecommerce projects. Create a product details page, and also make sure that the user pages (like profile, account, order to be favorite) and this types of stuff watch. Make sure the header is the whole UI is functional; we should have any dummy URI, and also make sure the authentication also works and can handle both users and admins. In the admin dashboard pages, make sure we can edit the marketing UI like CMS and correctly manage content like a normal dashboard. Complete this project.
And out of 100 tell me how much we are now at delivering the project to the client?

------------------------------------------------------------------------------------------------------------------

current cards compoents that don't have py and remove it as "image-cards" componets and for other cards please put py-6 and we should use image-cards for all product listing in the marketiing pages and in all other places we will use normal cards with py-6 correctly
Please keep it mind let the cards compoents be same so most of the cards

------------------------------------------------------------------------------------------------------------------

On our website, please do this one: First of all please run this project and do these changes and also ui automatically check if all the things works or not properly
1. Change the primary color of the default light and dark theme to use this color: oklch(28.04% 0.05154 150.113).
2. In the header, in dark mode, at the marketing header logo, please put a container to make the logo bigger in size in a light and dark mode. Especially in that mode, please put a container around the logo at the marketing header and on the language switcher. In there, please remove the current icon and put BL and EN text.
3. At the sub-header, put a background color instead of making it transparent. Also, it has more items, so please use a more professional multi-item.
4. On the marketing page landing hero, please decrease the height of the landing hero to half of the current height.

------------------------------------------------------------------------------------------------------------------

