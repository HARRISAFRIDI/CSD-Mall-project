import { prisma } from './src/lib/prisma';

async function main() {
  const products = await prisma.product.findMany({
    where: {
      title: {
        contains: 'bata',
      }
    }
  });

  if (products.length > 0) {
    const product = products[0];
    const directUrl = "https://png.pngtree.com/png-vector/20231006/ourmid/pngtree-versatile-black-leather-shoe-for-your-adventurous-work-or-png-image_10077073.png";
    
    await prisma.product.update({
      where: { id: product.id },
      data: { imageUrl: directUrl }
    });
    
    console.log(`Updated product ${product.title} with the direct image URL.`);
  } else {
    console.log('Product not found.');
  }
}

main()
  .catch(e => console.error(e));
