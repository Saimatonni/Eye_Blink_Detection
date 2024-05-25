import React from 'react'
import ServiceCard from './ServiceCard'
import { Col } from "reactstrap"
const servicesData = [
    {
        imgUrl: "",
        title: "...",
        desc: "search list........."
    },
    {
        imgUrl: "",
        title: "..",
        desc: "search list........."
    },
    {
        imgUrl: "",
        title: "...",
        desc: "search list........."
    },
]

const ServiceList = () => {
    return (
        <>
            {
                servicesData.map((item, index) =>
                    <Col lg='3' key={index}>
                        <ServiceCard item={item} /></Col>)
            }
        </>
    )
}

export default ServiceList