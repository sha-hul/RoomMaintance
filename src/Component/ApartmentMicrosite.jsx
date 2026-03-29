import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { decryptParams } from "../Service/apartmentmicrositeService"

const ApartmentMicrosite = () => {
    const location = useLocation();
    const [data, setData] = useState(null);

    // Extract encrypted params
    const queryParams = new URLSearchParams(location.search);
    const facid = queryParams.get("facid");
    const locid = queryParams.get("locid");
    const apart = queryParams.get("apart");

    useEffect(() => {
        debugger;
        const decryptParam = async () => {
            const result = await decryptParams(facid, locid, apart);
            setData(result);
        };

        decryptParam();
    }, [facid, locid, apart]);

    if (!data) return <div>Loading...</div>;

    return (
        <div>
            <h1>Apartment Microsite</h1>
            <p>Facility ID: {data.facid}</p>
            <p>Location ID: {data.locid}</p>
            <p>Apartment: {data.apart}</p>
        </div>
    );
};

export default ApartmentMicrosite;