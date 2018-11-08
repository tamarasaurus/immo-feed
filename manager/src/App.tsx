import React, { Component, ChangeEvent } from "react";
import Results from "./services/Results";
import ResultItem from "./components/ResultItem";
import { pickBy, identity } from "lodash";
import { Slider, Icon, Form, Row, Col, Button } from "antd";

import "antd/lib/slider/style/css";
import "antd/lib/grid/style/css";
import "antd/lib/form/style/css";
import "antd/lib/button/style/css";

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
      pages: 1
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
      filters: response.filters
    });

    return response;
  }

  handlePageIncrease() {
    const pages = this.state.pages;

    if (this.state.page < pages) {
      this.fetchResults(Math.min(pages, this.state.page + 1));
    }
  }

  handlePageDecrease() {
    if (this.state.page > 1) {
      this.fetchResults(Math.max(1, this.state.page - 1));
    }
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

  searchChanged(event: ChangeEvent<HTMLInputElement>) {
    this.setState({ filterValue: event.target.value });
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
      <div>
        <header>🏠 immo-feed</header>
        <main>
          <aside>
            {this.state.pinned.length > 0 ? (
              <section>
                <h3 className="result-group">Pinned</h3>
                <div className="results">
                  {this.state.pinned.map((result: any) => (
                    <ResultItem
                      onHide={this.onHide.bind(this)}
                      onUnpin={this.onUnpin.bind(this)}
                      onPin={this.onPin.bind(this)}
                      key={result.link}
                      data={result}
                    />
                  ))}
                </div>
              </section>
            ) : (
              ""
            )}

            <h3 className="result-group">All results</h3>
            <section>
              <input
                name="filterValue"
                className="search"
                placeholder="Search results"
                type="text"
                onChange={this.searchChanged.bind(this)}
                onKeyDown={this.searchCleared.bind(this)}
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
              </Row>
              <div className="pagination">
                <Button onClick={this.handlePageDecrease.bind(this)}>Prev</Button>
                <span className="pagination-number">{this.state.page} / {this.state.pages}</span>
                <Button onClick={this.handlePageIncrease.bind(this)}>Next</Button>
              </div>
            </section>
            <section>
              <div className="results">
                {this.state.results.map((result: any) => (
                  <ResultItem
                    onHide={this.onHide.bind(this)}
                    onUnpin={this.onUnpin.bind(this)}
                    onPin={this.onPin.bind(this)}
                    key={result.link}
                    data={result}
                  />
                ))}
              </div>
            </section>
          </aside>
        </main>
      </div>
    );
  }
}

export default App;
