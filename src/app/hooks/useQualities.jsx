import PropTypes from "prop-types";
import React, { useContext, useEffect, useState } from "react";
import QualitiesService from "../services/qualities.service";
import { toast } from "react-toastify";

const QualitiesContext = React.createContext();

export const useQualities = () => {
    return useContext(QualitiesContext);
};

export const QualitiesProvider = ({ children }) => {
    const [isLoading, setLoading] = useState(true);
    const [qualities, setQualities] = useState([]);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (error !== null) {
            toast(error);
            setError(null);
        }
    }, [error]);
    useEffect(() => {
        getQualitiesList();
    }, []);
    console.log("qual", qualities);
    const getQualities = (item) => {
        const a = [];
        item.forEach((qual) => {
            qualities.find((elem) => {
                return qual === elem._id ? a.push(elem) : undefined;
            });
        });
        return a;
    };
    async function getQualitiesList() {
        try {
            const { content } = await QualitiesService.get();
            setQualities(content);
            setLoading(false);
        } catch (error) {
            errorCatcher(error);
        }
    }
    function errorCatcher(error) {
        const { message } = error.response.data;
        setError(message);
    }
    return (
        <QualitiesContext.Provider value={{ isLoading, qualities, getQualities }}>
            {children}
        </QualitiesContext.Provider>
    );
};
QualitiesProvider.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};
