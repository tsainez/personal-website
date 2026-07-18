import unittest
from unittest.mock import patch
import sys
from pathlib import Path

# Add scripts directory to sys.path to import the script
scripts_path = Path(__file__).resolve().parent.parent / "scripts"
sys.path.append(str(scripts_path))

import generate_placeholder_cutouts

class TestGeneratePlaceholderCutouts(unittest.TestCase):

    def setUp(self):
        # Clear the lru_cache for _font before every test
        generate_placeholder_cutouts._font.cache_clear()

    @patch('PIL.Image.Image.save')
    def test_polaroid(self, mock_save):
        generate_placeholder_cutouts.polaroid()
        mock_save.assert_called_once()
        args, _ = mock_save.call_args
        self.assertTrue(str(args[0]).endswith('polaroid.png'))

    @patch('PIL.Image.Image.save')
    def test_sticker(self, mock_save):
        generate_placeholder_cutouts.sticker()
        mock_save.assert_called_once()
        args, _ = mock_save.call_args
        self.assertTrue(str(args[0]).endswith('sticker.png'))

    @patch('PIL.Image.Image.save')
    def test_badge(self, mock_save):
        generate_placeholder_cutouts.badge()
        mock_save.assert_called_once()
        args, _ = mock_save.call_args
        self.assertTrue(str(args[0]).endswith('badge.png'))

    @patch('PIL.Image.Image.save')
    def test_button88(self, mock_save):
        generate_placeholder_cutouts.button88()
        mock_save.assert_called_once()
        args, _ = mock_save.call_args
        self.assertTrue(str(args[0]).endswith('button88.png'))

    @patch('PIL.Image.Image.save')
    def test_speech_bubble(self, mock_save):
        generate_placeholder_cutouts.speech_bubble()
        mock_save.assert_called_once()
        args, _ = mock_save.call_args
        self.assertTrue(str(args[0]).endswith('speech.png'))

    @patch('generate_placeholder_cutouts.Path.exists')
    @patch('PIL.ImageFont.truetype')
    def test_font_truetype_found(self, mock_truetype, mock_exists):
        # Simulate first font not found, second font found
        mock_exists.side_effect = [False, True]
        generate_placeholder_cutouts._font(12)
        mock_truetype.assert_called_once_with("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 12)

    @patch('generate_placeholder_cutouts.Path.exists')
    @patch('PIL.ImageFont.load_default')
    def test_font_default(self, mock_load_default, mock_exists):
        # Simulate fonts not found
        mock_exists.return_value = False
        generate_placeholder_cutouts._font(12)
        mock_load_default.assert_called_once()

if __name__ == '__main__':
    unittest.main()
