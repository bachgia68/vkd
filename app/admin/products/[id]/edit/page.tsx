import ProductForm from '../../ProductForm';

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default function EditProduct({ params }: EditProductPageProps) {
  return <ProductForm productId={params.id} />;
}
