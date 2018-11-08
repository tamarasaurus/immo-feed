import React, { Component, ChangeEvent } from "react";
import Results from "./services/Results";
import ResultItem from "./components/ResultItem";
import { pickBy, identity } from "lodash";
import { Slider, Icon, Form, Row, Col, Button, Pagination } from "antd";
import Search from "antd/lib/input/Search";

interface Result {
  name: string;
  price: number;
  size: number;
  description: string;
  link: string;
  photo: string;
  createdAt: Date;
  updatedAt: Date;
  hidden: boolean;
  seen: boolean;
  pinned: boolean;
}

interface ResultFilter {
  min: number;
  max: number;
}

interface AppState {
  filterValue: string;
  pinned: Result[];
  results: Result[];
  page: number;
  pages: number;
  total: number;
  filters: { [name: string]: ResultFilter };
  minPrice?: number;
  maxPrice?: number;
  minSize?: number;
  maxSize?: number;
}

class App extends Component<{}, AppState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      filterValue: "",
      filters: {
        price: { min: 0, max: 2000000 },
        size: { min: 0, max: 100000 }
      },
      results: [],
      pinned: [],
      page: 1,
      pages: 1000,
      total: 1
    };
  }

  async fetchResults(page: number) {
    const { filterValue, minPrice, maxPrice, minSize, maxSize } = this.state;

    const params = pickBy(
      {
        filterValue,
        minPrice,
        maxPrice,
        minSize,
        maxSize,
        page
      },
      identity
    );

    const response = await Results.fetchAll(params);
    const pinned = await Results.fetchPinned();

    this.setState({
      pinned,
      results: response.results,
      page: response.page,
      pages: response.pages,
      filters: response.filters,
      total: response.total
    });

    return response;
  }

  paginationChanged(page: number) {
    console.log("paginationChanged", page);
    this.setState({ page });
  }

  searchCleared(event: KeyboardEvent) {
    if (event.keyCode === 8) {
      this.setState({ filterValue: "" });
    }
  }

  componentDidMount() {
    this.fetchResults(1);
  }

  onPin(id: string) {
    Results.pin(id).then(() => this.fetchResults(this.state.page));
  }

  searchChanged(filterValue: string) {
    this.setState({ filterValue });
  }

  onUnpin(id: string) {
    Results.unpin(id).then(() => this.fetchResults(this.state.page));
  }

  onHide(id: string) {
    Results.hide(id).then(() => this.fetchResults(this.state.page));
  }

  componentDidUpdate(prevProps: any, prevState: AppState) {
    if (
      prevState.filterValue !== this.state.filterValue ||
      prevState.minPrice !== this.state.minPrice ||
      prevState.maxPrice !== this.state.maxPrice ||
      prevState.minSize !== this.state.minSize ||
      prevState.maxSize !== this.state.maxSize
    ) {
      this.fetchResults(1);
    }

    if (prevState.page !== this.state.page) {
      this.fetchResults(this.state.page);
    }
  }

  priceFilterChanged(values: [number, number]) {
    console.log("priceFilterChanged", values);
    this.setState({
      minPrice: values[0],
      maxPrice: values[1]
    });
  }

  sizeFilterChanged(values: [number, number]) {
    console.log("sizeFilterChanged", values);
    this.setState({
      minSize: values[0],
      maxSize: values[1]
    });
  }

  // @TODO - If set as pinned, also set seen, same with hidden
  // @TODO - Fetch pinned items first
  // @TODO - Add personal note to the listing, add icon on card for that
  // @TODO - Add a checkbox for 'Show hidden'
  render() {
    const priceMarks = {
      0: "0€",
      [this.state.filters.price.max]: `${this.state.filters.price.max}€`
    };

    const sizeMarks = {
      0: "0m²",
      [this.state.filters.size.max]: `${this.state.filters.size.max}m²`
    };

    return (
      <Row>
        <header>🏠 immo-feed</header>

        {this.state.pinned.length > 0 ? (
          <Row type="flex" justify="center">
            <Col span={18}>
              <h3>Pinned</h3>
              {this.state.pinned.map((result: any) => (
                <ResultItem
                  onHide={this.onHide.bind(this)}
                  onUnpin={this.onUnpin.bind(this)}
                  onPin={this.onPin.bind(this)}
                  key={result.link}
                  data={result}
                />
              ))}
            </Col>
          </Row>
        ) : (
          ""
        )}

        <Row type="flex" justify="center">
          <Col span={18}>
            <h3 className="result-group">All results</h3>

            <Search
              size="large"
              placeholder="Search by name, description, place"
              onSearch={this.searchChanged.bind(this)}
            />

            {/* <div className="toolbar">
            <select className="actions">
              <option className="action-item">hide</option>
              <option className="action-item">pin</option>
            </select>
            <select className="sort">
              <option className="sort-item">by date ^</option>
              <option className="sort-item">by price ^</option>
              <option className="sort-item">by size ^</option>
            </select>
            <select className="export">
              <option className="export-option">Export current filters</option>
              <option className="export-option">Export JSON</option>
              <option className="export-option">Export CSV</option>
            </select>
          </div> */}

            <Row gutter={12}>
              <Col span={12}>
                <Slider
                  onAfterChange={this.priceFilterChanged.bind(this)}
                  range={true}
                  min={this.state.filters.price.min}
                  max={this.state.filters.price.max}
                  marks={priceMarks}
                  defaultValue={[
                    this.state.filters.price.min,
                    this.state.filters.price.max
                  ]}
                />
                <Slider
                  onAfterChange={this.sizeFilterChanged.bind(this)}
                  range={true}
                  min={this.state.filters.size.min}
                  max={this.state.filters.size.max}
                  marks={sizeMarks}
                  defaultValue={[
                    this.state.filters.size.min,
                    this.state.filters.size.max
                  ]}
                />
              </Col>
              <Col span={6} offset={6}>
                <Pagination
                  simple
                  onChange={this.paginationChanged.bind(this)}
                  current={this.state.page}
                  total={this.state.total}
                />
              </Col>
            </Row>

            {this.state.results.map((result: any) => (
              <ResultItem
                onHide={this.onHide.bind(this)}
                onUnpin={this.onUnpin.bind(this)}
                onPin={this.onPin.bind(this)}
                key={result.link}
                data={result}
              />
            ))}
          </Col>

          <Col span={6} offset={16}>
            <Pagination
              simple
              onChange={this.paginationChanged.bind(this)}
              current={this.state.page}
              total={this.state.total}
            />
          </Col>
        </Row>
      </Row>
    );
  }
}

export default App;
