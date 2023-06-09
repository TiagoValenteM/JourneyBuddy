import React from "react";

const Header = () => {
    return (
        <header
            style={{
                position: "fixed",
                top: "2%",
                padding: "2px",
                paddingLeft: 30,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "80%",
                maxWidth: "1650px",
                margin: "auto",
                right: "0",
                left: "0",
                zIndex: "50",
                borderRadius: "20px",
                height: "50px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.08)",
                backdropFilter: "blur(10px)",
                backgroundColor: "rgba(249, 249, 249, 1)",
            }}
        >
            <div style={{display: "flex", alignItems: "center", marginLeft: "1vw"}}>
                <img
                    src="/journeybuddy.jpg"
                    alt=""
                    width={35}
                    height={35}
                    style={{borderRadius: "20%", marginRight: "10px"}}
                />
                <h1 style={{fontSize: "18px", color: "#333"}}>Journey Buddy (Dashboard)</h1>
            </div>
        </header>
    );
};

export default Header;
