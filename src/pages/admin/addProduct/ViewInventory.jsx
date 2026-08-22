import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEdit,
  faTrash,
  faPrint,
  faBox,
  faCoins,
} from "@fortawesome/free-solid-svg-icons";
import {
  getAllProductApi,
  getAllCategoryApi,
  baseURL,
  getAllSubcategoriesApi,
  deleteProductByIdApi,
  editProductByIdApi,
} from "../../../Apis/Api";
import EditProductModal from "./view/EditProductModel";
import ProductModal from "./view/ViewProductModel";
import Barcode from "react-barcode";
import ReactDOM from "react-dom";
import toast from "react-hot-toast";

const ViewInventory = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const productResponse = await getAllProductApi();
        const categoryResponse = await getAllCategoryApi();
        const subCategoryResponse = await getAllSubcategoriesApi();

        if (productResponse.status === 200) {
          setProducts(productResponse.data.products || []);
        } else {
          setError("Failed to fetch products");
        }

        if (categoryResponse.status === 200) {
          setCategories(categoryResponse.data.categories || []);
        } else {
          setError("Failed to fetch categories");
        }

        if (subCategoryResponse.status === 200) {
          setSubCategories(subCategoryResponse.data.subCategories || []);
        } else {
          setError("Failed to fetch subcategories");
        }
      } catch (error) {
        setError("An error occurred while fetching data");
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSaveProduct = async (updatedProduct) => {
    try {
      const response = await editProductByIdApi(
        selectedProduct._id,
        updatedProduct
      );
      const updated = response.data.product;

      setProducts((prev) =>
        prev.map((p) => (p._id === updated._id ? updated : p))
      );

      toast.success("Product updated successfully!");
      setEditModalOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Unknown error";
      toast.error(`Failed to update the product: ${message}`);
      console.error("Error updating product:", error.response?.data || error);
    }
  };

  const handleView = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setEditModalOpen(true);
  };

  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (confirmed) {
      try {
        const response = await deleteProductByIdApi(productId);
        if (response.status === 200) {
          setProducts((prevProducts) =>
            prevProducts.filter((product) => product._id !== productId)
          );
          toast.success("Product deleted successfully!");
        } else {
          setError("Failed to delete the product. Please try again.");
        }
      } catch (err) {
        setError(
          "An error occurred while deleting the product. Please try again later."
        );
      }
    }
  };

  const formatPriceForBarcode = (price) => {
    const priceStr = price.toString();
    if (priceStr.length <= 2) {
      return priceStr;
    }
    const firstTwoDigits = priceStr.substring(0, 2);
    const asterisks = "*".repeat(priceStr.length - 2);
    return `${firstTwoDigits}${asterisks}`;
  };

  const handlePrintBarcode = (sku, wholesaleCode, discountedPrice) => {
    const printWindow = window.open("", "", "width=400,height=200");

    const formattedPrice = formatPriceForBarcode(discountedPrice);

    const styles = `
      @media print {
        body {
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
        .barcode-label {
          width: 1.57in;
          height: 1.118in;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          position: relative;
        }
        .wholesale-code {
          position: absolute;
          top: 5px;
          left: 5px;
          font-size: 8px;
          text-align: left;
          white-space: nowrap;
          overflow: hidden;
          padding: 0 2px;
          text-overflow: ellipsis;
        }
        .barcode-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 100%;
        }
        .barcode-text {
          font-size: 9px;
          text-align: center;
          margin-top: 5px;
        }
        svg {
          max-width: 100%;
          max-height: 100%;
        }
      }
    `;

    printWindow.document.head.innerHTML = `
      <style>${styles}</style>
    `;

    printWindow.document.body.innerHTML = `
      <div class="barcode-label">
        <div class="wholesale-code">${wholesaleCode}</div>
        <div class="barcode-container">
          <div id="barcode"></div>
          <div class="barcode-text">#${formattedPrice}**56</div>
        </div>
      </div>
    `;

    ReactDOM.render(
      <Barcode
        value={sku}
        displayValue={true}
        width={1.2}
        height={50}
        fontSize={10}
        margin={2}
        textMargin={2}
      />,
      printWindow.document.getElementById("barcode"),
      () => {
        printWindow.print();
        printWindow.close();
      }
    );
  };

  const getCategoryName = (categoryId) => {
    if (!categoryId) return "No category";
    if (typeof categoryId === "object" && categoryId !== null) {
      return categoryId.name || "No category";
    }
    const categoryIdString = categoryId.toString();
    const category = categories.find((cat) => {
      const catIdString = cat._id.toString();
      return catIdString === categoryIdString;
    });
    return category ? category.name : "No category";
  };

  const getSubcategoryName = (subcategoryId) => {
    if (!subcategoryId) return null;
    if (typeof subcategoryId === "object" && subcategoryId !== null) {
      return subcategoryId.name || null;
    }
    const subcategoryIdString = subcategoryId.toString();
    const subcategory = subCategories.find((sub) => {
      const subIdString = sub._id.toString();
      return subIdString === subcategoryIdString;
    });
    return subcategory ? subcategory.name : null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#AB3430]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const inventoryProducts = filteredProducts.filter(
    (product) => !product.showProductinSite
  );

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md">
                  <FontAwesomeIcon
                    icon={faBox}
                    className="text-white text-lg"
                  />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Total Inventory
                </p>
              </div>
              <p className="text-4xl font-bold text-gray-900 mt-3">
                {
                  products.filter((product) => !product.showProductinSite)
                    .length
                }
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Hidden from storefront
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md">
                  <FontAwesomeIcon
                    icon={faCoins}
                    className="text-white text-lg"
                  />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Total Inventory Cost
                </p>
              </div>
              <p className="text-4xl font-bold text-gray-900 mt-3">
                Npr.&nbsp;
                {products
                  .filter((product) => !product.showProductinSite)
                  .reduce(
                    (acc, product) =>
                      acc + (product.totalQuantity || 0) * (product.price || 0),
                    0
                  )
                  .toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Current inventory valuation
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Header section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Inventory</h1>
            <p className="text-sm text-gray-600 mt-1">
              {inventoryProducts.length} products in inventory
            </p>
          </div>
          <div className="relative w-full lg:w-80">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M6.75 11.25a4.5 4.5 0 118.999.001 4.5 4.5 0 01-8.999-.001z"
                />
              </svg>
            </div>
            <input
              type="search"
              className="block w-full pl-12 pr-4 py-3 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#AB3430] focus:border-transparent transition-all"
              placeholder="Search by product name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Product Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Pricing
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Subcategory
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Stock Info
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Barcode
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {inventoryProducts.map((product) => (
                <tr
                  key={product._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-xl overflow-hidden bg-gray-100 border-2 border-gray-200 flex-shrink-0 shadow-sm">
                        <img
                          src={`${baseURL}/${product.images[0]}`}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-gray-900 text-sm truncate">
                          {product.name}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">SKU:</span>
                          <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                            {product.sku}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 w-12">
                          Cost:
                        </span>
                        <span className="font-semibold text-sm text-emerald-600">
                          Npr. {product.price}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 w-12">
                          Retail:
                        </span>
                        <span className="font-semibold text-sm text-[#AB3430]">
                          Npr. {product.discountedPrice}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {getCategoryName(product.category)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {product.subcategory?.name ||
                    getSubcategoryName(product.subcategory) ? (
                      <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                        {product.subcategory?.name ||
                          getSubcategoryName(product.subcategory)}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400 font-medium">
                        —
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                        <span className="text-sm font-bold text-gray-900">
                          {product.totalQuantity} pcs
                        </span>
                      </div>
                      <div className="text-xs text-gray-600">
                        Value:{" "}
                        <span className="font-semibold text-gray-900">
                          Npr.{" "}
                          {(
                            (product.totalQuantity || 0) * (product.price || 0)
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="inline-flex rounded-lg border-2 border-gray-200 bg-white p-1.5 shadow-sm">
                      <Barcode
                        value={product.sku}
                        width={1}
                        height={30}
                        fontSize={10}
                        margin={0}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleView(product)}
                        className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                        title="View Details"
                      >
                        <FontAwesomeIcon icon={faEye} className="text-sm" />
                      </button>
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
                        title="Edit Product"
                      >
                        <FontAwesomeIcon icon={faEdit} className="text-sm" />
                      </button>
                      <button
                        onClick={() =>
                          handlePrintBarcode(
                            product.sku,
                            product.wholesaleCode,
                            product.discountedPrice
                          )
                        }
                        className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                        title="Print Barcode"
                      >
                        <FontAwesomeIcon icon={faPrint} className="text-sm" />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        title="Delete Product"
                      >
                        <FontAwesomeIcon icon={faTrash} className="text-sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {inventoryProducts.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              No inventory found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm
                ? "Try adjusting your search terms"
                : "All products are currently listed on the storefront"}
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {isModalOpen && (
        <ProductModal
          product={selectedProduct}
          categories={categories}
          subCategories={subCategories}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
      {editModalOpen && (
        <EditProductModal
          product={selectedProduct}
          isEditing={true}
          isOpen={editModalOpen}
          onClose={handleCloseEditModal}
          categories={categories}
          subCategories={subCategories}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
};

export default ViewInventory;
