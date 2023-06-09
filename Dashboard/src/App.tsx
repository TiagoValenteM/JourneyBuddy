import React, {useEffect, useState} from "react";
import "./App.css";
import Guide from "./models/guides";
import {getAllGuides} from "./services/ManageGuides";
import Switch from "react-ios-switch";
import {UpdateGuideStatus} from "./services/ManageGuides";
import average from "./utils/average";
import Header from "./components/Header";
import {PulseLoader} from "react-spinners";

const App = () => {
    const [guides, setGuides] = useState<Guide[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGuides = async () => {
            try {
                const fetchedGuides = await getAllGuides();
                setGuides(fetchedGuides);
                setLoading(false);
            } catch (error) {
                console.log("Error fetching guides:", error);
                setLoading(false);
            }
        };

        fetchGuides();
    }, []);

    const handleStatusChange = async (index: number, checked: boolean) => {
        const updatedGuides = [...guides];
        const updatedGuide = {
            ...updatedGuides[index],
            status: checked ? "approved" : "pending",
        };
        updatedGuides[index] = updatedGuide;
        setGuides(updatedGuides);

        try {
            await UpdateGuideStatus(updatedGuide);
        } catch (error) {
            console.log("Error updating guide status:", error);
        }
    };

    function averageRating(guide: Guide) {
        return guide?.rating
            ? average(guide?.rating?.map((rating) => rating.rate))
            : 0;
    }

    return (
        <div>
            <Header/>
            <div style={{marginTop: "100px"}}/>
            {loading ? (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <PulseLoader size={12} color={"#333"}/>
                </div>

            ) : (

                <div
                    style={{
                        justifyContent: "center",
                        display: "flex",
                        flexWrap: "wrap",
                        flexDirection: "row",
                        alignItems: "center",
                        width: "95%",
                        margin: "auto",
                    }}
                >
                    {guides
                        .sort((a, b) => (b.dateCreated > a.dateCreated ? 1 : -1))
                        .map((guide, index) => (
                            <div
                                key={index}
                                style={{
                                    backgroundColor: "#f9f9f9",
                                    padding: "20px",
                                    margin: "20px",
                                    borderRadius: "8px",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "flex-start",
                                    width: "300px",
                                    height: "400px",
                                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.08)",
                                }}
                            >
                                <h1
                                    style={{
                                        fontSize: "22px",
                                        fontWeight: "bold",
                                        marginBottom: "5px",
                                        color: "#333",
                                    }}
                                >
                                    {guide.title}
                                </h1>
                                <h5
                                    style={{
                                        fontSize: "16px",
                                        marginBottom: "5px",
                                        color: "#666",
                                        display: "-webkit-box",
                                        WebkitLineClamp: 4,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {guide.description}
                                </h5>
                                <p
                                    style={{
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                        marginBottom: 5,
                                        color: "#333",
                                    }}
                                >
                                    @{guide?.author}
                                </p>
                                <p
                                    style={{
                                        fontSize: "14px",
                                        marginBottom: 5,
                                        color: "#999",
                                    }}
                                >
                                    {guide.dateCreated
                                        .slice(0, 10)
                                        .split("-")
                                        .reverse()
                                        .join("-")}
                                </p>
                                <p
                                    style={{
                                        fontSize: "14px",
                                        marginBottom: 5,
                                        color: "#666",
                                    }}
                                >
                                    Rating: {averageRating(guide)} out of 5
                                </p>

                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-end",
                                        justifyContent: "flex-end",
                                        marginTop: "auto",
                                    }}
                                >
                                    <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                                        <p
                                            style={{
                                                fontSize: "14px",
                                                marginBottom: "10px",
                                                color: "#999",
                                            }}
                                        >
                                            {guide.status.charAt(0).toUpperCase() + guide.status.slice(1)}
                                        </p>
                                        <Switch
                                            checked={guide.status === "approved"}
                                            onChange={(checked: boolean) => handleStatusChange(index, checked)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
};

export default App;
