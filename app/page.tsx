"use client";
import Image from "next/image";
import styles from "./page.module.css";

import { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import Spinner from "react-bootstrap/Spinner";

const columns: GridColDef[] = [
  { field: "ConsumedQuantity", headerName: "Consumed Quantity", width: 300 },
  { field: "Cost", headerName: "Cost", width: 300 },
  { field: "ResourceGroup", headerName: "Resource Group", width: 300 },
  { field: "ServiceName", headerName: "Service Name", width: 300 },
];

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [tabledata, setTabledata] = useState([]);

  useEffect(() => {
    setLoading(true);
    //Get Raw data from API
    fetch("https://engineering-task.elancoapps.com/api/raw")
      .then((response) => response.json())
      .then((json: any) => {
        //remove duplicate
        let newjson = json.filter(
          (ele: any, ind: any) =>
            ind ===
            json.findIndex(
              (elem: any) =>
                elem.Cost === ele.Cost &&
                elem.ConsumedQuantity === ele.ConsumedQuantity
            )
        );

        //adding index to the response
        const indexedJson = newjson.map((item: any, index: any) =>
          Object.assign(item, { index })
        );

        setTabledata(indexedJson);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }

  return (
    <main className={styles.main}>
      <div style={{ height: 300, width: "100%" }}>
        <DataGrid
          rows={tabledata}
          columns={columns}
          getRowId={(row) => row.index}
        />
      </div>
    </main>
  );
}
