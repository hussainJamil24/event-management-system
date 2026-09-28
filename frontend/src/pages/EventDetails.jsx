import Navbar from "../components/Navbar";

export default function EventDetails(){
    return(
        <>
            <Navbar
                showSearch={false}
                showJoin={false}
                showProfile={true}
                navbarClassName="eventdetails-navbar"
            />
             <h1>Event Details</h1>
        </>
    );
}