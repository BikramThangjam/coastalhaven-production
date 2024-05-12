
import { useEffect, useState } from "react";
import "../styles/List.scss";
import Navbar from "../components/Navbar";
import { useSelector, useDispatch } from "react-redux";
import { API_URL } from "../config";
import {setReservationList} from "../redux/state";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer";
import SkeletonLoader from "../components/SkeletonLoader";


const ReservationList = () => {
    const [loading, setLoading] = useState(true);
    const userId = useSelector(state => state.user._id);
    const reservationList = useSelector(state => state.user.reservationList)
    const dispatch = useDispatch();

    const getReservationList = async () => {
        try {
            const response = await fetch(`${API_URL}/users/${userId}/reservations`, {
                method: "GET"
            })

            const data = await response.json();
           
            dispatch(setReservationList(data));
            setLoading(false);

        } catch (err) {
            console.log("Failed to fetch trip list!", err.message);
        }
    }

    useEffect(()=>{
        getReservationList();
    },[])


  return (
    <div className="list-container">
        <Navbar />
        <h1 className="title-list">Your Reservation List</h1>
        <div className="list">
            { loading 
                ? <SkeletonLoader/> 
                : reservationList?.length < 1 ? (
                    <h3>Customers haven't booked your property yet!</h3>
                ):(
                    reservationList?.map(({_id, listingId, hostId, startDate, endDate, totalPrice, booking=true, isReserved=true, customerId, createdAt}, index) => (
                        <ListingCard 
                            key={index} 
                            id={_id}
                            listingId={listingId._id}
                            creator={hostId._id}
                            listingPhotoPaths={listingId.listingPhotoPaths}
                            city={listingId.city}
                            state={listingId.state}
                            country={listingId.country}
                            category = {listingId.category }
                            startDate={startDate} 
                            endDate={endDate} 
                            totalPrice={totalPrice}
                            booking={booking}
                            isReserved={isReserved}
                            customer = {customerId}
                            createdAt = {createdAt}
                        />
                    ))
                )
            }
        </div>
        <footer>
            <Footer  />
        </footer>
    </div>
  )
}

export default ReservationList
