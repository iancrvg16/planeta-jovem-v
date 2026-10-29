"""Regression: missing/partial raw deliveries cannot delete a published country."""
import copy
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('processamento', ROOT/'scripts/processar-entregas.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class PreserveInventoryTests(unittest.TestCase):
    def setUp(self):
        self.current = json.loads((ROOT/'src/data/generated/midias.json').read_text())

    def test_missing_jambor_keeps_all_24_real_records(self):
        generated = [m for m in self.current if m['country'] != 'jambor']
        self.assertEqual(module.preserve_inventory(generated, self.current, ROOT/'public'), self.current)

    def test_partial_delivery_keeps_missing_records_and_existing_order(self):
        generated = copy.deepcopy(self.current[:1])
        generated[0]['note'] = 'updated metadata'
        merged = module.preserve_inventory(generated, self.current, ROOT/'public')
        self.assertEqual(merged[0]['note'], 'updated metadata')
        self.assertEqual(merged[1:], self.current[1:])

    def test_missing_derivative_fails_without_mutating_input(self):
        before = copy.deepcopy(self.current)
        with tempfile.TemporaryDirectory() as directory:
            with self.assertRaisesRegex(RuntimeError, 'manifestos preservados'):
                module.preserve_inventory([], self.current, Path(directory))
        self.assertEqual(self.current, before)

    def test_ambiguous_records_fail(self):
        with self.assertRaisesRegex(RuntimeError, 'ambíguo'):
            module.preserve_inventory([self.current[0], self.current[0]], self.current, ROOT/'public')


if __name__ == '__main__':
    unittest.main()
