import React, { useState } from "react";
import { Drawer, Radio, Switch, Button, Row, Col } from "antd";
import { BranchesOutlined, AimOutlined, AreaChartOutlined, AppstoreOutlined, SettingOutlined } from "@ant-design/icons";

const MapSettings = ({
  mapType,
  setMapType,
  showHeatmap,
  setShowHeatmap,
  showCluster,
  setShowCluster,
  showGeofence,
  setShowGeofence,
  showTraffic,
  setShowTraffic,
  showPOI,
  setShowPOI,

}) => {
  const [visible, setVisible] = useState(false);
  
  const switchOptionStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 15px",
    margin: "8px 0",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.3s ease",
  };

  const toggleDrawer = () => {
    setVisible(!visible);
  };

  return (
    <>
      <Button
        type="primary"
        icon={<SettingOutlined />}
        onClick={toggleDrawer}
        className="map-settings-button"
      >
        Map Settings
      </Button>

      <Drawer
        title="Map Settings"
        style={{ textAlign: "center" , color: "#000"}}
        placement="right"
        onClose={toggleDrawer}
        open={visible}
        width={380}
        className="map-settings-drawer"
      >
        <div
          className="setting-section"
          style={{
            padding: "16px",
            textAlign: "center",
            backgroundColor: "#f0f2f5",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h3>Map Type</h3>
          <Radio.Group
            value={mapType}
            onChange={(e) => setMapType(e.target.value)}
          >
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Radio.Button
                  value="roadmap"
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <BranchesOutlined style={{ marginRight: "8px" }} />
                  Roadmap
                </Radio.Button>
              </Col>
              <Col span={12}>
                <Radio.Button
                  value="satellite"
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AimOutlined style={{ marginRight: "8px" }} />
                  Satellite
                </Radio.Button>
              </Col>
              <Col span={12}>
                <Radio.Button
                  value="terrain"
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AreaChartOutlined style={{ marginRight: "8px" }} />
                  Terrain
                </Radio.Button>
              </Col>
              <Col span={12}>
                <Radio.Button
                  value="hybrid"
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AppstoreOutlined style={{ marginRight: "8px" }} />
                  Hybrid
                </Radio.Button>
              </Col>
            </Row>
          </Radio.Group>
        </div>

        <div
          className="setting-section"
          style={{
            padding: "16px",
            textAlign: "center",
            backgroundColor: "#f0f2f5",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h3>Visualization Options</h3>

          <div className="switch-option" style={switchOptionStyle}>
            <div className="option-label">Enable Clustering</div>
            <Switch
              checked={showCluster}
              onChange={(checked) => setShowCluster(checked)}
              className="switch-style"
            />
          </div>

          <div className="switch-option" style={switchOptionStyle}>
            <div className="option-label">Show Heatmap</div>
            <Switch
              checked={showHeatmap}
              onChange={(checked) => setShowHeatmap(checked)}
              className="switch-style"
            />
          </div>

          <div className="switch-option" style={switchOptionStyle}>
            <div className="option-label">Show Geofences</div>
            <Switch
              checked={showGeofence}
              onChange={(checked) => setShowGeofence(checked)}
              className="switch-style"
            />
          </div>
        </div>

        <div className="setting-section" style={{
            padding: "16px",
            textAlign: "center",
            backgroundColor: "#f0f2f5",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}>
          <h3>Miscellaneous</h3>
          <div className="switch-option" style={switchOptionStyle}>
            <div className="option-label">Show Traffic</div>
            <Switch
              checked={showTraffic}
              onChange={(checked) => setShowTraffic(checked)}
              className="switch-style"
            />
          </div>

          <div className="switch-option" style={switchOptionStyle}>
            <div className="option-label">Show Points of Interest</div>
            <Switch
              checked={showPOI}
              onChange={(checked) => setShowPOI(checked)}
              className="switch-style"
            />
          </div>

         
        </div>
        
      </Drawer>
    </>
  );
};

export default MapSettings;
