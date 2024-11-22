import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF, { jsPDFOptions } from "jspdf";
import "jspdf-autotable";
import SERVER_URL from "../env";
import { jsPDFConstructor, jsPDFDocument } from "jspdf-autotable";
import { format } from "date-fns";

const BillingForm = () => {
  const [portal, setPortal] = useState("Pharmacy"); // default portal
  const [items, setItems] = useState<any[]>([]); // items fetched from the API
  const [selectedItems, setSelectedItems] = useState<any[]>([]); // items user selected with quantity
  const [total, setTotal] = useState(0);
  const [patientName, setPatientName] = useState(""); // New state for patient name
  const [opdId, setOpdId] = useState(""); // New state for OPD ID
  const [patientAge, setPatientAge] = useState("");
  const [patientAddress, setPatientAddress] = useState("");
  const [referredBy, setReferredBy] = useState("");

  interface Item {
    id: string;
    name: string;
    batchNo: string;
    price: number;
    salePrice: number;
  }
  
  // Define types for selected items
  interface SelectedItem {
    name: string;
    batchNo: string;
    quantity: number;
    price: number;
    salePrice: number;
  }
  // Fetch items from API based on the portal selected
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/api/v1/${portal}/all`, {
          withCredentials: true,
        });
        setItems(response.data);
        if(portal === "Pathology"){
          setSelectedItems([{  
            name: "", 
            value_observed: "", 
            unit: "", 
            normal_range: "",
            price: 0  // Add price field
          }]);
        }else{
         setSelectedItems([{ name: "", quantity: 1, price: 0, batchNo: "", salePrice: 0 }]);
        }
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
  const handleItemChange = (index, field, value, price, salePrice, batchNo) => {
    const updatedItems = [...selectedItems];
    
    // If the field is price, convert it to a number
    if (field === "price") {
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: parseFloat(value) || 0
      };
    } else {
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
      };
    }
    
    // If the field is 'name', update the price as well
    if (field === "name") {
      updatedItems[index].price = price;
      updatedItems[index].salePrice = salePrice;
      updatedItems[index].batchNo = batchNo;
    }

    setSelectedItems(updatedItems);
    calculateTotal(updatedItems);
  };

  // Add item to the selected items list
  const addItem = () => {
    if(portal === "Pathology"){
      setSelectedItems([...selectedItems, {  
        name: "", 
        value_observed: "", 
        unit: "", 
        normal_range: "",
        price: 0  // Add price field
      }]);
    }else{
     setSelectedItems([...selectedItems, { name: "", quantity: 1, price: 0, batchNo: "", salePrice: 0 }]);
    }
  };

  // Calculate the total bill amount
  const calculateTotal = (updatedItems) => {
    const totalAmount = updatedItems.reduce((sum, item) => {
      if (portal === "Pharmacy") {
        return sum + (item.price * (item.quantity || 1));
      } else {
        return sum + (Number(item.price) || 0);
      }
    }, 0);
    setTotal(totalAmount);
  };

    // Generate PDF for the bill
    const generatePDF = async (): Promise<void> => {
      try {
        const doc:jsPDFConstructor = new jsPDF();
        
        // Add the header image to the PDF
        const headerImg = await getBase64Image('/Dadra_Letter Head-fotor.png');
        
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
          doc.addImage(headerImg, 'PNG', 0, 0, 210, 80);
          console.log(selectedItems);
          let columns, rows;
          if (portal === "Pharmacy") {
            columns = ["Item Name", "Batch No.", "Quantity", "Sale Price","MRP"];
            rows = selectedItems.map((item) => [
              item.name,
              item.batchNo,
              item.quantity,
              item.price,
              item.salePrice,
              // (item.price * item.quantity).toFixed(2),
            ]);
          } else if (portal === "Pathology") {
            columns = ["Test Name", "Value Observed", "Unit", "Normal Range", "Price"];
            rows = selectedItems.map((item) => [
              item.name,
              item.value_observed || "",
              item.unit || "",
              item.normal_range || "",
              item.price || "0"
            ]);
          }

          // Set font size for patient details
          doc.setFontSize(11);
          
          // Calculate starting positions
          const startY = 45; // Adjust this value based on your header image height
          const leftColX = 14;
          const rightColX = 120;
          const lineSpacing = 7;

          // Add patient details in two columns
          // Left Column
          doc.text(`Patient Name: ${patientName}`, leftColX, startY);
          doc.text(`Age: ${patientAge}`, leftColX, startY + lineSpacing);
          doc.text(`Address: ${patientAddress}`, leftColX, startY + (lineSpacing * 2));
          
          // Right Column
          doc.text(`Date: ${format(new Date(), 'dd/MM/yyyy')}`, rightColX, startY);
          doc.text(`OPD ID: ${opdId}`, rightColX, startY + lineSpacing);
          doc.text(`Referred By: ${referredBy}`, rightColX, startY + (lineSpacing * 2));

          // Add a line separator
          doc.setLineWidth(0.5);
          doc.line(14, startY + (lineSpacing * 3), 196, startY + (lineSpacing * 3));

          // Reset font size for table title
          doc.setFontSize(12);
          doc.text(`Details:`, 14, startY + (lineSpacing * 4));

          // Add the table with items
          doc.autoTable({
            head: [columns],
            body: rows,
            startY: startY + (lineSpacing * 5),
            theme: "striped",
            headStyles: {
              fillColor: "#375f4a"
            },
            margin: { left: 14, right: 14 },
          });

          // Add total amount at the bottom
          doc.setFontSize(12);
          doc.text(`Total Amount: ${total.toFixed(2)} Rs`, 14, doc.lastAutoTable.finalY + 10);

          // Save the PDF
          doc.save("bill.pdf");
        };
        if(portal === "Pharmacy") await updateQuantity();
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

  const updateQuantity = async () => {
    try {
      const response = await axios.post(`${SERVER_URL}/api/v1/${portal.toLowerCase()}/updateQuantity`, selectedItems, {
        withCredentials: true,
      });
    } catch (error) {
      console.error(`Error fetching ${portal} items:`, error);
    }
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
          
          {/* Patient Name and OPD ID fields on the same line */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', margin: '2px 9px' }}>
            <input
              type="text"
              placeholder="Patient Name"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              style={{
                // flex: '1 1 200px',
                padding: '4px 8px',
                margin: '4px 0',
                boxSizing: 'border-box',
                fontSize: '14px',
                height: '30px'
              }}
            />
            <input
              type="text"
              placeholder="Age"
              value={patientAge}
              onChange={(e) => setPatientAge(e.target.value)}
              style={{
                // flex: '1 1 100px',
                padding: '4px 8px',
                margin: '4px 0',
                boxSizing: 'border-box',
                fontSize: '14px',
                height: '30px'
              }}
            />
            <input
              type="text"
              placeholder="OPD ID"
              value={opdId}
              onChange={(e) => setOpdId(e.target.value)}
              style={{
                // flex: '1 1 150px',
                padding: '4px 8px',
                margin: '4px 0',
                boxSizing: 'border-box',
                fontSize: '14px',
                height: '30px'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', margin: '2px 9px' }}>
            <input
              type="text"
              placeholder="Address"
              value={patientAddress}
              onChange={(e) => setPatientAddress(e.target.value)}
              style={{
                // flex: '2 1 300px',
                padding: '4px 8px',
                margin: '4px 0',
                boxSizing: 'border-box',
                fontSize: '14px',
                height: '30px'
              }}
            />
            <input
              type="text"
              placeholder="Referred By"
              value={referredBy}
              onChange={(e) => setReferredBy(e.target.value)}
              style={{
                // flex: '1 1 200px',
                padding: '4px 8px',
                margin: '4px 0',
                boxSizing: 'border-box',
                fontSize: '14px',
                height: '30px'
              }}
            />
          </div>

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
                        selectedItem?.price || 0,
                        selectedItem?.salePrice || 0,
                        selectedItem?.batchNo || ""
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
                
                {portal === "Pharmacy" ? (
                  <label>
                    Quantity:
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      onChange={(e) =>
                        handleItemChange(index, "quantity", e.target.value, item.price, item?.salePrice, item.batchNo)
                      }
                    />
                  </label>
                ) : (
                  <>
                    <label>
                      Value Observed:
                      <input
                        type="text"
                        value={item.value_observed}
                        onChange={(e) =>
                          handleItemChange(index, "value_observed", e.target.value, item.price, item?.salePrice, item.batchNo)
                        }
                      />
                    </label>
                    <label>
                      Unit:
                      <input
                        type="text"
                        value={item.unit}
                        onChange={(e) =>
                          handleItemChange(index, "unit", e.target.value, item.price, item?.salePrice, item.batchNo)
                        }
                      />
                    </label>
                    <label>
                      Normal Range:
                      <input
                        type="text"
                        value={item.normal_range}
                        onChange={(e) =>
                          handleItemChange(index, "normal_range", e.target.value, item.price, item?.salePrice, item.batchNo)
                        }
                      />
                    </label>
                    <label>
                      MRP:
                      <input
                        type="text"
                        value={item.price}
                        min="0"
                        onChange={(e) =>
                          handleItemChange(index, "price", e.target.value, e.target.value, item?.salePrice, item.batchNo)
                        }
                      />
                    </label>
                  </>
                )}
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
            Print
          </button>
        </form>
      </section>
    </section>
  );
};

export default BillingForm;
