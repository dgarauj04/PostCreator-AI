from src.app import create_app
import os

app = create_app()

if __name__ == '__main__':
    is_development = os.environ.get('FLASK_ENV') == 'development'
    port = int(os.environ.get('PORT', 5000))
    print(f"🚀 Iniciando servidor na porta {port}")
    print(f"🔐 Modo Debug: {is_development}")
    app.run(host='0.0.0.0', port=port, debug=is_development)