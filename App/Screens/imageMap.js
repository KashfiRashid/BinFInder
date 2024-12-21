/**
 * imageMap Object:
 * 
 * This object maps different types of waste (Landfill, Compost, Recycle, and Paper) to a series of images
 * that represent different categories or examples for each waste type.
 * 
 * The images are stored locally in the `./Images/` folder, with each category (e.g., Landfill, Compost, Recycle, Paper)
 * having 10 different images (L1, L2, ..., L10 for Landfill, C1, C2, ..., C10 for Compost, and so on).
 * This is useful for quiz questions where each category needs to be visually represented.
 * 
 * Usage:
 * - The object can be accessed dynamically to display images for each quiz question.
 * - Each waste category (Landfill, Compost, Recycle, Paper) has its own key and contains a series of images.
 */

export const imageMap = {
  /**
   * Landfill Category:
   * Images related to landfill waste (L1, L2, ..., L10)
   * These images can be used for quiz questions about landfill waste.
   */
  Landfill: {
    L1: require('./Images/Landfill/L1.jpg'),
    L2: require('./Images/Landfill/L2.jpg'),
    L3: require('./Images/Landfill/L3.jpg'),
    L4: require('./Images/Landfill/L4.jpg'),
    L5: require('./Images/Landfill/L5.jpg'),
    L6: require('./Images/Landfill/L6.jpg'),
    L7: require('./Images/Landfill/L7.jpg'),
    L8: require('./Images/Landfill/L8.jpg'),
    L9: require('./Images/Landfill/L9.jpg'),
    L10: require('./Images/Landfill/L10.jpg'),
  },

  /**
   * Compost Category:
   * Images related to compostable waste (C1, C2, ..., C10)
   * These images can be used for quiz questions about composting and compostable materials.
   */
  Compost: {
    C1: require('./Images/Compost/C1.jpg'),
    C2: require('./Images/Compost/C2.jpg'),
    C3: require('./Images/Compost/C3.jpg'),
    C4: require('./Images/Compost/C4.jpg'),
    C5: require('./Images/Compost/C5.jpg'),
    C6: require('./Images/Compost/C6.jpg'),
    C7: require('./Images/Compost/C7.jpg'),
    C8: require('./Images/Compost/C8.jpg'),
    C9: require('./Images/Compost/C9.jpg'),
    C10: require('./Images/Compost/C10.jpg'),
  },

  /**
   * Recycle Category:
   * Images related to recyclable waste (R1, R2, ..., R10)
   * These images can be used for quiz questions about recycling and recyclable materials.
   */
  Recycle: {
    R1: require('./Images/Recycle/R1.jpg'),
    R2: require('./Images/Recycle/R2.jpg'),
    R3: require('./Images/Recycle/R3.jpg'),
    R4: require('./Images/Recycle/R4.jpg'),
    R5: require('./Images/Recycle/R5.jpg'),
    R6: require('./Images/Recycle/R6.jpg'),
    R7: require('./Images/Recycle/R7.jpg'),
    R8: require('./Images/Recycle/R8.jpg'),
    R9: require('./Images/Recycle/R9.jpg'),
    R10: require('./Images/Recycle/R10.jpg'),
  },

  /**
   * Paper Category:
   * Images related to paper waste (P1, P2, ..., P10)
   * These images can be used for quiz questions about paper recycling or paper waste management.
   */
  Paper: {
    P1: require('./Images/Paper/P1.jpg'),
    P2: require('./Images/Paper/P2.jpg'),
    P3: require('./Images/Paper/P3.jpg'),
    P4: require('./Images/Paper/P4.jpg'),
    P5: require('./Images/Paper/P5.jpg'),
    P6: require('./Images/Paper/P6.jpg'),
    P7: require('./Images/Paper/P7.jpg'),
    P8: require('./Images/Paper/P8.jpg'),
    P9: require('./Images/Paper/P9.jpg'),
    P10: require('./Images/Paper/P10.jpg'),
  },
};
