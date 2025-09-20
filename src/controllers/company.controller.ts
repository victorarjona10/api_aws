import { Request, Response } from "express";
import { ICompany } from "../models/company";
import { CompanyService } from "../services/company.service";
import axios from "axios";

import { IReview } from "../models/review";

const companyService = new CompanyService();


import dotenv from "dotenv";
dotenv.config();


export async function postCompany(req: Request, res: Response): Promise<void> {
  try {
    const company = req.body as ICompany;
    if (!company.name || !company.email || !company.password) {
      res
        .status(400)
        .json({ message: "Nombre, email y contraseña son obligatorios" });
      return;
    }
    if (!company.ownerId) {
      res.status(400).json({ message: "El id del propietario es obligatorio" });
      return;
    }
    
    const newCompany = await companyService.postCompany(company);
    res.status(200).json(newCompany);
    return;
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(403).json({ message: "El email ya está registrado" });
      return;
    } else {
      res
        .status(500)
        .json({ message: "Error al crear la empresa", error: error.message });
      return;
    }
  }
}

export async function getAllCompanies(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const companies = await companyService.getAllCompanies();
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ message: "Error getting companies", error });
  }
}

export async function getCompanyById(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = req.params.id;
    if (!id || id.length !== 24) {
      res.status(400).json({ message: "ID inválido" });
    }
    const company = await companyService.getCompanyById(id);
    if (!company) {
      res.status(404).json({ message: "Empresa no encontrada" });
      return;
    }
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: "Error getting company", error });
  }
}

export async function updateCompanyById(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = req.params.id;
    if (!id || id.length !== 24) {
      res.status(400).json({ message: "ID inválido" });
      return;
    }
    const company = req.body as ICompany;
    const updatedCompany = await companyService.updateCompanyById(id, company);
    if (!updatedCompany) {
      res.status(404).json({ message: "Empresa no encontrada" });
      return;
    }
    res.status(200).json(updatedCompany);
    return;
  } catch (error: any) {
    if (error.message === "El email ya está registrado") {
      // Enviar una respuesta clara para el error de email duplicado
      res.status(403).json({ message: error.message });
      return;
    } else {
      // Manejo genérico de errores
      res
        .status(500)
        .json({ message: "Error al actualizar el usuario", error });
    }
  }
}

export async function deleteCompanyById(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = req.params.id;
    if (!id || id.length !== 24) {
      res.status(400).json({ message: "ID inválido" });
    }
    const deletedCompany = await companyService.deleteCompanyById(id);
    if (!deletedCompany) {
      res.status(404).json({ message: "Empresa no encontrada" });
      return;
    }
    res.status(200).json(deletedCompany);
  } catch (error) {
    res.status(500).json({ message: "Error deleting company", error });
  }
}

export async function getCompanyWithProductsById(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = req.params.id;
    if (!id || id.length !== 24) {
      res.status(400).json({ message: "ID inválido" });
    }
    const company = await companyService.getCompanyWithProductsById(id);
    if (!company) {
      throw new Error("Company not found");
    }
    res.status(200).json(company);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting company with products", error });
  }
}

export async function getCompanies(req: Request, res: Response): Promise<void> {
  // Clave de API de Google Maps
  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY; // Reemplaza con tu clave de API
  //const ejemplo_solicitud = 'http://localhost:3000/companies?query=restaurant&lat=41.2804038&lng=1.9848002&radius=300';
  try {
    // Obtén los parámetros de la consulta
    const query = (req.query.query as string) || "Carrefour"; // Palabra clave para buscar
    const lat = parseFloat(req.query.lat as string) || 41.2804038; // Latitud
    const lng = parseFloat(req.query.lng as string) || 1.9848002; // Longitud
    const radius = parseInt(req.query.radius as string) || 300; // Radio en metros

    // URL de la API de Google Places
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json`;

    // Realiza la solicitud a la API de Google Places
    const response = await axios.get(url, {
      params: {
        query: query,
        location: `${lat},${lng}`,
        radius: radius,
        key: GOOGLE_API_KEY,
      },
    });

    // Procesa los resultados para devolver solo los datos necesarios
    const data = response.data as { results: any[] }; // Explicitly type response.data
    const results = data.results.map((place: any) => ({
      name: place.name,
      address: place.formatted_address,
      location: place.geometry?.location
        ? {
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
          }
        : null,
      rating: place.rating,
      userRatingsTotal: place.user_ratings_total,
      placeId: place.place_id,
      types: place.types,
      openingHours: place.opening_hours,
      photos: place.photos?.map((photo: any) => ({
        photoReference: photo.photo_reference,
        width: photo.width,
        height: photo.height,
      })),
      priceLevel: place.price_level,
      businessStatus: place.business_status,
      icon: place.icon,
      vicinity: place.vicinity,
      plusCode: place.plus_code,
    }));

    // Devuelve los resultados al cliente
    res.status(200).json(results);
  } catch (error) {
    console.error("Error al obtener lugares:");
    res.status(500).json({ error: "Error al obtener lugares" });
  }
}

export async function RateCompany(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    if (!id || id.length !== 24) {
      res.status(400).json({ message: "ID inválido" });
    }
    const { rating } = req.body as { rating: number };
    const updatedCompany = await companyService.RateCompany(id, rating);
    if (!updatedCompany) {
      res.status(404).json({ message: "Empresa no encontrada" });
      return;
    }
    res.status(200).json(updatedCompany);
  } catch (error) {
    res.status(500).json({ message: "Error al calificar la empresa", error });
  }
}

export async function reviewCompany(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const review = req.body.review as Partial<IReview>;

    // Validación de datos obligatorios
    if (!review.user_id || !review.company_id || review.rating === undefined) {
      console.error(
        "Faltan datos obligatorios para crear o actualizar la reseña:",
        review
      );
      res
        .status(400)
        .json({
          message:
            "Faltan datos obligatorios para crear o actualizar la reseña",
        });
      return; // Detiene la ejecución
    }

    // Llama al servicio para procesar la reseña
    const newReview = await companyService.reviewCompany(review);

    // Envía la respuesta al cliente
    res.status(200).json(newReview);
    return; // Detiene la ejecución
  } catch (error) {
    console.error("Error en reviewCompany:", error);

    // Envía una respuesta de error al cliente
    res
      .status(500)
      .json({ message: "Error al crear o actualizar la reseña", error });
    return; // Detiene la ejecución
  }
}

export async function getCompanyReviews(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = req.params.id;
    if (!id || id.length !== 24) {
      res.status(400).json({ message: "ID inválido" });
      return;
    }
    const reviews = await companyService.getCompanyReviews(id);
    if (!reviews) {
      res.status(404).json({ message: "Reseñas no encontradas" });
      return;
    }
    res.status(200).json(reviews);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener las reseñas de la empresa", error });
    return;
  }
}

export async function addProductToCompany(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const companyId = req.params.id;
    const { productId } = req.body;

    // Validar los IDs
    if (!companyId || companyId.length !== 24) {
      res.status(400).json({ message: "ID de empresa inválido" });
      return;
    }

    if (!productId || productId.length !== 24) {
      res.status(400).json({ message: "ID de producto inválido" });
      return;
    }

    // Llamar al servicio para añadir el producto
    const updatedCompany = await companyService.addProductToCompany(
      companyId,
      productId
    );

    // Devolver la respuesta
    res.status(200).json(updatedCompany);
  } catch (error: any) {
    if (
      error.message === "Empresa no encontrada" ||
      error.message === "Producto no encontrado"
    ) {
      res.status(404).json({ message: error.message });
    } else if (
      error.message === "El producto ya está asociado a esta empresa"
    ) {
      res.status(409).json({ message: error.message });
    } else {
      res.status(500).json({
        message: "Error al añadir producto a la empresa",
        error: error.message,
      });
    }
  }
}


export async function getCompanyByName(req: Request, res: Response): Promise<void> {
  try {
    const searchText = req.params.search as string;

    if (!searchText) {
      res.status(400).json({ message: "El texto de búsqueda es obligatorio" });
      return;
    }

    const companies = await companyService.getCompanyByName(searchText);
    res.status(200).json(companies);
  } catch (error) {
    console.error("Error en getCompanySearch Controller:", error);
    res.status(500).json({ message: "Error al buscar compañías"});
  }
}

export async function getCompaniesByProductName(req: Request, res: Response): Promise<void> {
  try {
    const productName = req.params.name;

    if (!productName) {
      res.status(400).json({ message: "El nombre del producto es obligatorio" });
      return;
    }

    const companies = await companyService.getCompaniesByProductName(productName);
    res.status(200).json(companies);
  } catch (error) {
    console.error("Error en getCompaniesByProductName Controller:", error);
    res.status(500).json({ message: "Error al buscar empresas por nombre de producto" });
  }
}

export async function loginCompany(req: Request, res: Response): Promise<void> {
      try {
          const { email, password } = req.body;
          if (!email || !password) {
              res.status(400).json({ message: "Email y contraseña son obligatorios" });
              return;
          }
          const company = await companyService.loginCompany(email, password);
          if (!company) {
              res.status(401).json({ message: "Email o contraseña incorrectos" });
              return;
          }
          res.status(200).json(company);
      } catch (error) {
          res.status(500).json({ message: "Error al iniciar sesión", error });
      }
}

export async function updateCompanyAvatar(req: Request, res: Response): Promise<void> {
  try {
    const { email, avatar } = req.body;
  
    await companyService.updateAvatar(avatar, email);
    res.status(200).json({message: "Avatar actualizado correctamente"});
    return;
  } catch (error) {
    res.status(500).json({ message: "Error updating avatar", error });
    return;
  }
    
}

export async function getPendingOrdersByCompanyId(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = req.params.id;
    if (!id || id.length !== 24) {
      res.status(400).json({ message: "ID inválido" });
    }
    const orders = await companyService.getPendingOrdersByCompanyId(id);
    if (!orders) {
      res.status(404).json({ message: "Pedidos no encontrados" });
      return;
    }
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error getting orders", error });
  }
}

export async function putCompanyPhoto(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = req.params.id;
    const { photo } = req.body;
    const updatedAvatar = await companyService.putCompanyPhoto(id, photo);
    res.status(200).json(updatedAvatar);
  } catch (error) {
    res.status(500).json({ message: "Error updating avatar", error });
  }
}

export async function updateCompanyPhotos(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = req.params.id;
    const { photos } = req.body;
    const updatedAvatar = await companyService.updateCompanyPhotos(id, photos);
    res.status(200).json(updatedAvatar);
  } catch (error) {
    res.status(500).json({ message: "Error updating avatar", error });
  }
}





    

