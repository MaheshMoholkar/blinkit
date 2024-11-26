import mongoose from "mongoose";
import { Product } from "../models/products.ts";
import { Category } from "../models/category.ts";
import "dotenv/config";
import { categories, products } from "./seed.ts";

const MONGO_URI =
  "mongodb+srv://admin:jUjh1W0yIRVF1rGy@cluster0.zpmtg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);

    await Product.deleteMany({});
    await Category.deleteMany({});

    const categoryDocs = await Category.insertMany(categories);

    const categoryMap = categoryDocs.reduce((map, category) => {
      map.set(category.name, category._id);
      return map;
    }, new Map());

    const productWithCategoryIds = products.map((product) => ({
      ...product,
      category: categoryMap.get(product.category),
    }));

    await Product.insertMany(productWithCategoryIds);

    console.log("Seeded Successfully");
  } catch (error) {
    console.log(error);
  } finally {
    mongoose.connection.close();
  }
}

seed();
