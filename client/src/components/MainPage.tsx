import React, {FC, useEffect, useState} from 'react';
import {Button, Col, Container, Form, FormSelect, Row, Table} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import InfiniteScroll from "react-infinite-scroll-component";
import {IData} from "../models/IData";
import DataService from "../services/DataService";
import { saveAs } from 'file-saver';

const MainPage: FC = () => {
    const [data, setData] = useState<IData[]>([]);
    const [page, setPage] = useState(0);
    const [region, setRegion] = useState('en_US');
    const [errors, setErrors] = useState(0);
    const [seed, setSeed] = useState(1);

    const regions = [
        { label: 'USA (en)', value: 'en_US' },
        { label: 'Spain (es)', value: 'es_ES' },
        { label: 'Ukraine (uk)', value: 'uk_UA' },
        { label: 'Russia (ru)', value: 'ru_RU' },
    ];

    const fetchMoreData = async () => {
        try {
            const response = await DataService.getData(region, errors, seed, page, 10);
            const moreData = response.data;
            setData(oldData => [...oldData, ...moreData]);
            setPage(prevPage => prevPage + 1);
        } catch (error) {
            console.error("Error fetching more data: ", error);
        }
    }

    useEffect(() => {
        async function fetchData() {
            const response = await DataService.getData(region, errors, seed, 0, 20);
            const newData = response.data;
            setData(newData);
            setPage(1);
        }

        fetchData().catch(error => {
            console.error("Error fetching data: ", error);
        });

    }, [region, errors, seed]);

    async function exportToCsv() {
        DataService.getCsvData(region, errors, seed, 0, data.length).then(response => {
            const csvData = new Blob([response.data], {type: 'text/csv;charset=utf-8;'});
            saveAs(csvData, "data.csv");
        });
    }

    return (
        <Container>
            <div className="w-100" style={{ minWidth: "445px" }}>
                <Row>
                    <Col>
                        <hr />
                        <h1>Fake data generator</h1>
                        <hr />
                    </Col>
                </Row>

                <Row className="mb-3 align-items-center">
                    <Col xs={2} className="text-start pl-12 fw-bolder">
                        <Form.Label className="mb-0">Region:</Form.Label>
                    </Col>
                    <Col xs={2} >
                        <FormSelect value={region} onChange={(e) => setRegion(e.target.value)}>
                            {regions.map(region => (
                                <option key={region.value} value={region.value}>{region.label}</option>
                            ))}
                        </FormSelect>
                    </Col>
                </Row>

                <Row className="mb-3 align-items-center">
                    <Col xs={2} className="text-start pl-12 fw-bolder">
                        <Form.Label className="mb-0">Errors quantity:</Form.Label>
                    </Col>

                    <Col xs={2}>
                        <Form.Control
                            type="number"
                            step="0.01"
                            min="0"
                            onFocus={(e) => e.target.select()}
                            onClick={(e) => (e.target as HTMLInputElement).select()}
                            value={errors}
                            onChange={(e) => {
                                const value = Number(e.target.value);
                                if (!isNaN(value) && value <= 1000) {
                                    setErrors(value);
                                }
                            }}
                        />
                    </Col>

                    <Col xs={2} className="">
                        <Form.Range
                            step="0.25"
                            min="0"
                            max="10"
                            value={errors}
                            onChange={(e) => setErrors(Number(e.target.value))}
                        />
                    </Col>
                </Row>

                <Row className="mb-3 align-items-center">
                    <Col xs={2} className="text-start pl-12 fw-bolder">
                        <Form.Label className="mb-0">Seed:</Form.Label>
                    </Col>
                    <Col xs={2}>
                        <Form.Control
                        type="number"
                        min="0"
                        onFocus={(e) => e.target.select()}
                        onClick={(e) => (e.target as HTMLInputElement).select()}
                        value={seed}
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            if (!isNaN(value) && value <= Number.MAX_SAFE_INTEGER) {
                                setSeed(value);
                            }
                        }}
                        />
                    </Col>
                    <Col xs={2} className="">
                        <Button
                            onClick={() => setSeed(Math.ceil(Math.random() * Number.MAX_SAFE_INTEGER))}>
                            Random
                        </Button>
                    </Col>
                </Row>
                <Row id="scrollableDiv" className="overflow-auto mb-3" style={{ maxHeight: "500px" }}>
                    <InfiniteScroll
                        className="overflow-auto mb-3"
                        dataLength={data.length}
                        next={fetchMoreData}
                        hasMore={true}
                        loader={<h4>Loading...</h4>}
                        scrollableTarget="scrollableDiv"
                    >
                        <Table>
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>id</th>
                                <th>Full name</th>
                                <th>Address</th>
                                <th>Phone</th>
                            </tr>
                            </thead>
                            <tbody>
                            {data.map((item: IData, index) => (
                                <tr key={index}>
                                    <td>{item.number}</td>
                                    <td>{item.id}</td>
                                    <td>{item.fullName}</td>
                                    <td>{item.address}</td>
                                    <td>{item.phone}</td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </InfiniteScroll>
                </Row>
                <Row className="mb-3">
                    <Col>
                        <Button onClick={exportToCsv}>Export to CSV</Button>
                    </Col>
                </Row>
            </div>
        </Container>
    )
}

export default MainPage;
