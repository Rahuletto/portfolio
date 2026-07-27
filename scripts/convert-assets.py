import os
from PIL import Image

def process_directory(directory):
    if not os.path.exists(directory):
        return
    
    for root, _, files in os.walk(directory):
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in ['.png', '.jpg', '.jpeg']:
                png_path = os.path.join(root, file)
                webp_name = os.path.splitext(file)[0] + '.webp'
                webp_path = os.path.join(root, webp_name)
                
                try:
                    img = Image.open(png_path)
                    # Preserve RGBA for PNGs with transparency, or RGB for JPGs
                    if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
                        img = img.convert('RGBA')
                    else:
                        img = img.convert('RGB')

                    # Resize if width > 1920 for fast WebGL & rendering
                    if img.width > 1920:
                        ratio = 1920 / img.width
                        new_height = int(img.height * ratio)
                        img = img.resize((1920, new_height), Image.Resampling.LANCZOS)
                    
                    img.save(webp_path, 'WEBP', quality=90)
                    print(f'⚡ [Auto-WebP] Converted {file} (RGBA={img.mode=="RGBA"}) ({os.path.getsize(png_path)//1024}KB) -> {webp_name} ({os.path.getsize(webp_path)//1024}KB)')
                except Exception as e:
                    print(f'⚠️ [Auto-WebP] Failed to convert {file}: {e}')

if __name__ == '__main__':
    process_directory('public/assets')
