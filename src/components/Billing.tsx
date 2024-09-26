import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF, { jsPDFOptions } from "jspdf";
import "jspdf-autotable";
import SERVER_URL from "../env";
import { jsPDFConstructor, jsPDFDocument } from "jspdf-autotable";

const BillingForm = () => {
  const [portal, setPortal] = useState("Pharmacy"); // default portal
  const [items, setItems] = useState<Item[]>([]); // items fetched from the API
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]); // items user selected with quantity
  const [total, setTotal] = useState(0);

  interface Item {
    id: string;
    name: string;
    price: number;
  }
  
  // Define types for selected items
  interface SelectedItem {
    name: string;
    quantity: number;
    price: number;
  }
  // Fetch items from API based on the portal selected
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/api/v1/${portal}/all`, {
          withCredentials: true,
        });
        setItems(response.data);
        setSelectedItems([{ name: "", quantity: 1, price: 0 }]);
      } catch (error) {
        console.error(`Error fetching ${portal} items:`, error);
      }
    };

    fetchItems();
  }, [portal]);

  // Handle portal change
  const handlePortalChange = (e) => {
    setPortal(e.target.value);
    setSelectedItems([]); // Clear selected items when switching portals
    setTotal(0);
  };

  // Handle item selection and quantity update
  const handleItemChange = (index, field, value, price) => {
    const updatedItems = [...selectedItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };

    // If the field is 'name', update the price as well
    if (field === "name") {
      updatedItems[index].price = price;
    }

    setSelectedItems(updatedItems);
    calculateTotal(updatedItems); // Pass updatedItems to calculateTotal
  };

  // Add item to the selected items list
  const addItem = () => {
    setSelectedItems([...selectedItems, { name: "", quantity: 1, price: 0 }]);
  };

  // Calculate the total bill amount
  const calculateTotal = (updatedItems) => {
    const totalAmount = updatedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotal(totalAmount);
  };

    // Generate PDF for the bill
    const generatePDF = async (): Promise<void> => {
      try{
        const doc:jsPDFConstructor = new jsPDF();
    
        // Add the header image to the PDF (position: x: 0, y: 0)
        const headerImg = await getBase64Image('/Dadra_Letter Head-fotor.png'); // Use the relative path from the public folder
        
        // Define the maximum width and height of the image
        const maxWidth = 910; // Page width in jsPDF (for A4 size)
        const maxHeight = 30;  // You can adjust this for the height you want
    
        // Get image dimensions
        const img = new Image();
        img.src = headerImg;
        img.onload = () => {
          const aspectRatio = img.width / img.height;
          let imageWidth = maxWidth;
          let imageHeight = maxWidth / aspectRatio;
    
          // If height exceeds the maximum allowed height, scale down proportionally
          if (imageHeight > maxHeight) {
            imageHeight = maxHeight;
            imageWidth = maxHeight * aspectRatio;
          }
    
          // Add the image to the PDF with correct dimensions
          doc.addImage(headerImg, 'PNG', 0, 0, 210, 80); // Adjust width and height for your image
    
          // Table columns and rows
          const columns = ["Item Name", "Quantity", "Price", "Total"];
          const rows = selectedItems.map((item) => [
            item.name,
            item.quantity,
            item.price,
            (item.price * item.quantity).toFixed(2),
          ]);
    
          // Add title and table to PDF
          doc.text(`${portal} Bill Summary`, 14, imageHeight + 15); // Adjust the Y position to avoid overlap with the header
          doc.autoTable({
            head: [columns],
            body: rows,
            startY: imageHeight + 20, // Adjust the Y position after the header
            theme:"striped",
            headStyles:{
              fillColor: "#375f4a"
            }
          });
    
          // Add total amount at the end
          doc.text(`Total Amount: ${total.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 10);
    
          // Save the PDF
          doc.save("bill.pdf");
        };
      } catch (error) {
        console.error("Error generating PDF:", error);
        alert(`Failed to generate PDF: ${error.message}`);
      }
    };

   // Helper function to convert image to Base64
   const getBase64Image = (imgUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = imgUrl;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
    });
  };

  return (
    <section className="page">
      <section className="container form-component billing-form">
        <h1 className="form-title">Prepare Bill</h1>
        <form>
          {/* Portal Selection */}
          <label>
            Portal:
            <select value={portal} onChange={handlePortalChange}>
              <option value="Pharmacy">Pharmacy</option>
              <option value="Pathology">Pathology</option>
            </select>
          </label>

          {/* Item Selection */}
          <div className="items-section">
            <h3>Items</h3>
            {selectedItems.map((item, index) => (
              <div key={index} className="item">
                <label>
                  Name:
                  <select
                    value={item.name}
                    onChange={(e) => {
                      const selectedItem = items.find(
                        (itm:any) => itm.name === e.target.value
                      );
                      handleItemChange(
                        index,
                        "name",
                        e.target.value,
                        selectedItem?.price || 0
                      );
                    }}
                  >
                    <option value="">Select Item</option>
                    {items.map((itm) => (
                      <option
                        key={itm.id}
                        value={itm.name}
                        data-price={itm.price}
                      >
                        {`${itm.name} (${itm.price ?? 0}rs)`}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Quantity:
                  <input
                    type="number"
                    value={item.quantity}
                    min="1"
                    onChange={(e) =>
                      handleItemChange(index, "quantity", e.target.value, item.price)
                    }
                  />
                </label>
              </div>
            ))}

            <button type="button" onClick={addItem}>
              Add Item
            </button>
          </div>

          {/* Total Display */}
          <div className="total-section">
            <h3>Total Amount: ₹{total.toFixed(2)}</h3>
          </div>

          {/* Download PDF Button */}
          <button type="button" onClick={generatePDF}>
            Download PDF
          </button>
        </form>
      </section>
    </section>
  );
};

export default BillingForm;
