// admin/src/pages/Settings/index.js
import React, { useEffect, useState } from "react";

import redirectRequest from "../../api/redirect";

import { LoadingIndicatorPage, useNotification } from "@strapi/helper-plugin";

import { Stack } from "@strapi/design-system/Stack";
import { Button } from "@strapi/design-system/Button";
import { Grid, GridItem } from "@strapi/design-system/Grid";

import {
  ContentLayout,
  HeaderLayout,
  Box,
  Flex,
  Field,
  FieldLabel,
  FieldInput,
  Typography,
  LinkButton,
} from "@strapi/design-system";

import Check from "@strapi/icons/Check";

const Settings = () => {
  const [settings, setSettings] = useState({
    team: "",
    token: "",
    projectId: "",
    deploymentUrl: "",
    branch: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const toggleNotification = useNotification();

  useEffect(() => {
    redirectRequest.getSettings().then((res) => {
      setSettings(res.data);
      setIsLoading(false);
    });
  }, []);

  const handleSubmit = async () => {
    setIsSaving(true);

    const res = await redirectRequest.setSettings(settings);

    setSettings(res.data);
    setIsSaving(false);
    toggleNotification({
      type: "success",
      message: "Settings successfully updated",
    });
  };

  return (
    <>
      <HeaderLayout
        id="title"
        title="Redirect settings"
        subtitle="Manage the settings of the redirect plugin"
        primaryAction={
          isLoading ? (
            <></>
          ) : (
            <Button
              onClick={handleSubmit}
              startIcon={<Check />}
              size="L"
              disabled={isSaving}
              loading={isSaving}
            >
              Save
            </Button>
          )
        }
      ></HeaderLayout>
      {!settings && isLoading ? (
        <LoadingIndicatorPage />
      ) : (
        <ContentLayout>
          <Box
            background="neutral0"
            hasRadius
            shadow="filterShadow"
            paddingTop={6}
            paddingBottom={6}
            paddingLeft={7}
            paddingRight={7}
          >
            <Stack size={3}>
              <Grid gap={6}>
                <GridItem col={12} s={12}>
                  <Typography variant="beta" marginBottom={2}>
                    Vercel
                  </Typography>
                  <Field marginBottom={4} marginTop={2}>
                    <FieldLabel>Vercel deployment hook</FieldLabel>
                    <FieldInput
                      type="text"
                      placeholder=""
                      value={settings?.deploymentUrl ?? ""}
                      onChange={(e) => {
                        setSettings({
                          deploymentUrl: e.target.value,
                          projectId: settings?.projectId,
                          token: settings?.token,
                          team: settings?.team,
                          branch: settings?.branch,
                        });
                      }}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Vercel team</FieldLabel>
                    <FieldInput
                      type="text"
                      placeholder=""
                      value={settings?.team ?? ""}
                      onChange={(e) => {
                        setSettings({
                          token: settings?.token,
                          deploymentUrl: settings?.deploymentUrl,
                          projectId: settings?.projectId,
                          team: e.target.value,
                          branch: settings?.branch,
                        });
                      }}
                    />
                  </Field>
                  <Field marginBottom={4}>
                    <FieldLabel>Vercel api token</FieldLabel>
                    <FieldInput
                      type="text"
                      placeholder=""
                      value={settings?.token ?? ""}
                      onChange={(e) => {
                        setSettings({
                          token: e.target.value,
                          deploymentUrl: settings?.deploymentUrl,
                          projectId: settings?.projectId,
                          team: settings?.team,
                          branch: settings?.branch,
                        });
                      }}
                    />
                  </Field>
                  <Field marginBottom={4}>
                    <FieldLabel>Vercel project id</FieldLabel>
                    <FieldInput
                      type="text"
                      placeholder="prj_"
                      value={settings?.projectId ?? ""}
                      onChange={(e) => {
                        setSettings({
                          projectId: e.target.value,
                          deploymentUrl: settings?.deploymentUrl,
                          token: settings?.token,
                          team: settings?.team,
                          branch: settings?.branch,
                        });
                      }}
                    />
                  </Field>
                  <Field marginBottom={4}>
                    <FieldLabel>Vercel deploy hook reference</FieldLabel>
                    <FieldInput
                      type="text"
                      placeholder="main"
                      value={settings?.branch ?? ""}
                      onChange={(e) => {
                        setSettings({
                          projectId: settings?.projectId,
                          deploymentUrl: settings?.deploymentUrl,
                          token: settings?.token,
                          team: settings?.team,
                          branch: e.target.value,
                        });
                      }}
                    />
                  </Field>
                </GridItem>
              </Grid>
            </Stack>
          </Box>
        </ContentLayout>
      )}
    </>
  );
};

export default Settings;
