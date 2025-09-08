const db = require("../Models");
const axios = require('axios');
var dateTime = require('node-datetime');


const Stock_Modal = db.Stock;

async function AddBulkStockCron(req, res) {
    try {
      const config = {
          method: 'get',
          url: 'https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json',
      };
  
      const response = await axios(config);


      if (response.data.length > 0) {
  
  
          const filteredDataO = response.data.filter(element =>
              (element.instrumenttype === 'OPTIDX' || element.instrumenttype === 'OPTSTK') &&
              element.exch_seg === "NFO" && element.name != ""
          );
      
          const filteredDataF = response.data.filter(element =>
              (element.instrumenttype === 'FUTSTK' || element.instrumenttype === 'FUTIDX') &&
              element.exch_seg === "NFO" && element.name != ""
          );
  
       
          const filteredDataC = response.data.filter(element =>
              (element.symbol.slice(-3) === '-EQ' || element.symbol.slice(-3) === '-BE') && element.name != ""
          );
  
        
          const userDataSegment_O = await createUserDataArray(filteredDataO, "O");
          await insertData(userDataSegment_O);
       
          const userDataSegment_F = await createUserDataArray(filteredDataF, "F");
          await insertData(userDataSegment_F);
         
          const userDataSegment_C = await createUserDataArray(filteredDataC, "C");
          await insertData(userDataSegment_C);
  
      
          res.json({ 
            status: true, 
        });
      } else {
        res.json({ 
            status: true, 
        });
      }
  } catch (error) {
    res.json({ 
        status: false, 
    });
  }
  }
  
const DeleteTokenAliceToken = async (req, res) => {

    const pipeline = [
        {
            $match: {
                expiry: { $type: "string", $ne: "", $regex: /^[0-9]{8}$/ } // Ensures expiry is exactly 8 digits (DDMMYYYY)
            }
        },
        {
            $addFields: {
                expiryDate: {
                    $dateFromString: {
                        dateString: {
                            $concat: [
                                { $substr: ["$expiry", 4, 4] }, // Year (YYYY)
                                "-",
                                { $substr: ["$expiry", 2, 2] }, // Month (MM)
                                "-",
                                { $substr: ["$expiry", 0, 2] } // Day (DD)
                            ]
                        },
                        format: "%Y-%m-%d",
                        onError: null, // If conversion fails, set expiryDate to null
                        onNull: null
                    }
                }
            }
        },
        {
            $match: {
                expiryDate: { $lt: new Date() } // Delete expired tokens
            }
        },
        {
            $group: {
                _id: null,
                idsToDelete: { $push: "$_id" } // Collecting all matching _id values
            }
        },
        {
            $project: {
                _id: 0,
                idsToDelete: 1
            }
        }
    ];

    const result = await Stock_Modal.aggregate(pipeline)
    if (result.length > 0) {
        const idsToDelete = result.map(item => item._id);
        await Stock_Modal.deleteMany({ _id: { $in: result[0].idsToDelete } });
        res.json({ 
            status: true, 
            message: `${result[0].idsToDelete.length} expired tokens deleted.` 
        });
    } else {
        res.json({ 
            status: true, 
            message: 'No expired tokens found.' 
        });
       }
  
  }
  
  function createUserDataArray(data, segment) {
    let count = 0
    return data.map(element => {
     
        const option_type = element.symbol.slice(-2);
        const expiry_s = dateTime.create(element.expiry);
        const expiry = expiry_s.format('dmY');
        const strike_s = parseInt(element.strike);
        const strike = parseInt(strike_s.toString().slice(0, -2));
        const day_start = element.expiry.slice(0, 2);
        const moth_str = element.expiry.slice(2, 5);
        const year_end = element.expiry.slice(-2);
        const Dat = new Date(element.expiry);
        const moth_count = Dat.getMonth() + 1;
  
        const tradesymbol_m_w = `${element.name}${year_end}${moth_count}${day_start}${strike}${option_type}`;
  
        return {
            symbol: element.name,
            expiry: segment === "C" ? null : expiry,
            expiry_date: segment === "C" ? null : expiry.slice(0, -6),
            expiry_month_year: segment === "C" ? null : expiry.slice(2),
            expiry_str: segment === "C" ? null : element.expiry,
            strike: strike,
            option_type: option_type,
            segment: segment,  // Default segment
            instrument_token: element.token,
            lotsize: element.lotsize,
            tradesymbol: element.symbol,
            tradesymbol_m_w: tradesymbol_m_w,
            exch_seg: element.exch_seg
        }; 
    });
  }
  async function insertData(dataArray) {
    try {
        const existingTokens = await Stock_Modal.distinct("instrument_token", {});
        const filteredDataArray = dataArray.filter(userData => {
            return !existingTokens.includes(userData.instrument_token);
        });
        await Stock_Modal.insertMany(filteredDataArray);
    } catch (error) {
    }
  
  }


  module.exports = { AddBulkStockCron,DeleteTokenAliceToken };
