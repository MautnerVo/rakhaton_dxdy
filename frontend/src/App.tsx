import { NumberInput, SegmentedControl, Alert, LoadingOverlay, Loader, Box, Group, Button, Stack, Title, Card, Input } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { BarChart, Bar, CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

function App() {
    const [pldelka, setPldelka] = useState<string | number>('');
    const [plpocetlecebH, setPlpocetlecebH] = useState<string | number>('');
    const [plpocetleceb, setPlpocetleceb] = useState<string | number>('');
    const [plct, setPlct] = useState<string | undefined>('ne');
    const [plpocetlecebC, setPlpocetlecebC] = useState<string | number>('');
    const [tnmklasifikacenkodnula, setTnmklasifikacenkodnula] = useState<string | undefined>('ne');
    const [plpocetlecebR, setPlpocetlecebR] = useState<string | number>('');
    const [plsono, setPlsono] = useState<string | undefined>('ne');
    const [plpocetlecebT, setPlpocetlecebT] = useState<string | number>('');
    const [novotvarporadi, setNovotvarporadi] = useState<string | number>('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');

    const [recurrenceData, setRecurrenceData] = useState([]);
    const [shapData, setShapData] = useState([]);

    useEffect(() => {
        console.log("Recurrence data updated:", recurrenceData);
        console.log("SHAP data updated:", shapData);
    }, [recurrenceData, shapData]);

    const handleSubmit = async () => {
        const data = {
            pldelka: pldelka,
            plpocetlecebH: plpocetlecebH,
            plpocetleceb: plpocetleceb,
            plct: plct,
            plpocetlecebC: plpocetlecebC,
            tnmklasifikacenkodnula: tnmklasifikacenkodnula,
            plpocetlecebR: plpocetlecebR,
            plsono: plsono,
            plpocetlecebT: plpocetlecebT,
            novotvarporadi: novotvarporadi,
        }

        const url = "http://localhost:5000/predict";

        try {
            setLoading(true);
            const response = await fetch(
                url, {
                    method: "POST",
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const json = await response.json();
            setLoading(false);
            setError('');

            // Process recurrence data
            setRecurrenceData(json["prediction"][0].map((item: number, i: number) => ({ name: i + 1, y: 1 - item })));

            // Process SHAP data
            const shapProcessedData = json["shap_values"].map((item: { feature: string, importance: number }) => ({
                feature: item.feature,
                value: item.importance,
            }));
            setShapData(shapProcessedData);
        } catch (error: any) {
            setLoading(false);
            setError(error.message);
            console.error(error.message);
        }
    }

    return (
        <>
            <header>
                <Group justify="center" style={{ padding: "2em" }}>
                    <Title>BCRP</Title>
                </Group>
            </header>
            <main>
                <Stack>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <LoadingOverlay visible={loading} loaderProps={{ children: <Loader /> }} />
                        <Box pos="relative">
                            <Stack gap="2em">
                                {error && <Alert variant="light" color="red" title="Error" icon={<IconInfoCircle />}>
                                    {error}
                                </Alert>}
                                <Group>
                                    <Stack justify="space-between">
                                        <Group justify="space-between">
                                            <Input.Label>pl delka</Input.Label>
                                            <NumberInput
                                                value={pldelka}
                                                onChange={setPldelka}
                                            />
                                        </Group>
                                        <Group justify="space-between">
                                            <Input.Label>pl pocet leceb H</Input.Label>
                                            <NumberInput
                                                value={plpocetlecebH}
                                                onChange={setPlpocetlecebH}
                                            />
                                        </Group>
                                        <Group justify="space-between">
                                            <Input.Label>pl pocet leceb</Input.Label>
                                            <NumberInput
                                                value={plpocetleceb}
                                                onChange={setPlpocetleceb}
                                            />
                                        </Group>
                                        <Group justify="space-between">
                                            <Input.Label>pl ct</Input.Label>
                                            <SegmentedControl
                                                value={plct}
                                                data={[
                                                    { value: '0', label: 'ne' },
                                                    { value: '1', label: 'ano' },
                                                ]}
                                                onChange={setPlct}
                                            />
                                        </Group>
                                        <Group justify="space-between">
                                            <Input.Label>pl pocet leceb C</Input.Label>
                                            <NumberInput
                                                value={plpocetlecebC}
                                                onChange={setPlpocetlecebC}
                                            />
                                        </Group>
                                    </Stack>
                                    <Stack justify="space-between">
                                        <Group justify="space-between">
                                            <Input.Label>tnm klasifikace kod nula</Input.Label>
                                            <SegmentedControl
                                                value={tnmklasifikacenkodnula}
                                                data={[
                                                    { value: '0', label: 'ne' },
                                                    { value: '1', label: 'ano' },
                                                ]}
                                                onChange={setTnmklasifikacenkodnula}
                                            />
                                        </Group>

                                        <Group justify="space-between">
                                            <Input.Label>pl pocet leceb R</Input.Label>
                                            <NumberInput
                                                value={plpocetlecebR}
                                                onChange={setPlpocetlecebR}
                                            />
                                        </Group>
                                        <Group justify="space-between">
                                            <Input.Label>pl sono</Input.Label>
                                            <SegmentedControl
                                                value={plsono}
                                                data={[
                                                    { value: '0', label: 'ne' },
                                                    { value: '1', label: 'ano' },
                                                ]}
                                                onChange={setPlsono}
                                            />
                                        </Group>
                                        <Group justify="space-between">
                                            <Input.Label>pl pocet leceb T</Input.Label>
                                            <NumberInput
                                                value={plpocetlecebT}
                                                onChange={setPlpocetlecebT}
                                            />
                                        </Group>
                                        <Group justify="space-between">
                                            <Input.Label>novotvar poradi</Input.Label>
                                            <NumberInput
                                                value={novotvarporadi}
                                                onChange={setNovotvarporadi}
                                            />
                                        </Group>
                                    </Stack>
                                </Group>
                                <Group justify="center">
                                    <Button onClick={handleSubmit}>Vyhodnotit</Button>
                                </Group>
                            </Stack>
                        </Box>
                        <Stack>
                            <Group>
                                <LineChart width={700} height={350} data={recurrenceData}>
                                    <XAxis dataKey="name" />
                                    <YAxis domain={[0, 1]} />
                                    <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                                    <Line type="monotone" dataKey="y" stroke="red" dot={false} />
                                </LineChart>
                            </Group>
                            <Group>
                                <BarChart 
                                    width={700} 
                                    height={350} 
                                    data={shapData}
                                    margin={{ bottom: 100 }}
                                >
                                    <XAxis dataKey="feature" angle={-35} textAnchor="end" position="top" />
                                    <YAxis />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Bar dataKey="value" fill="#8884d8" />
                                </BarChart>
                            </Group>
                        </Stack>
                    </Card>
                </Stack>
            </main>
        </>
    );
}

export default App;
